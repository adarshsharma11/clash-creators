import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { joinClash } from "@/lib/api/clashes";
import { queryKeys } from "@/lib/api/query-keys";
import { resolveCreatorUsername } from "@/lib/clash-view";
import { invalidateJoinClashQueries } from "@/lib/query-invalidation";
import { joinClashSchema, type JoinClashInput } from "@/lib/validations/join-clash";
import type { PaginatedResult } from "@/types/api";
import type { ClashCreatorRef, ClashDetail, ClashLeaderboardItem, ClashParticipant, JoinClashResult } from "@/types/clash";

function normalizeJoinedCreator(creator: ClashCreatorRef, username: string): ClashCreatorRef {
  const resolved = resolveCreatorUsername(creator) || username;
  return {
    ...creator,
    username: resolved,
    displayName: creator.displayName || username,
    user: creator.user ?? {
      username: resolved,
      fullName: creator.displayName || username,
      avatarUrl: creator.avatarUrl,
    },
  };
}

function upsertParticipant(detail: ClashDetail, participant: ClashParticipant): ClashDetail {
  const exists = detail.participants.some((item) => item.creator.id === participant.creator.id);
  return {
    ...detail,
    participants: exists
      ? detail.participants.map((item) =>
          item.creator.id === participant.creator.id ? { ...item, creator: participant.creator } : item
        )
      : [...detail.participants, participant],
  };
}

function seedJoinedClashCaches(
  queryClient: QueryClient,
  result: JoinClashResult,
  username: string
) {
  const creator = result.participant?.creator;
  if (!creator) {
    return;
  }

  const participant: ClashParticipant = {
    joinedAt: result.participant.joinedAt,
    creator: normalizeJoinedCreator(creator, username),
    points: 0,
    rank: null,
  };

  const seedDetail = (current: ClashDetail | undefined): ClashDetail => {
    if (!current) {
      return {
        id: result.clash.id,
        title: result.clash.title,
        slug: result.clash.slug,
        description: null,
        status: result.clash.status,
        startsAt: result.clash.startsAt,
        endsAt: result.clash.endsAt,
        maxParticipants: result.clash.maxParticipants,
        category: null,
        participants: [participant],
        leaderboard: [],
        winner: null,
      };
    }

    return upsertParticipant(current, participant);
  };

  queryClient.setQueryData(queryKeys.clashes.detail(result.clash.id), seedDetail);
  if (result.clash.slug !== result.clash.id) {
    queryClient.setQueryData(queryKeys.clashes.detail(result.clash.slug), seedDetail);
  }

  const seedLeaderboard = (current: PaginatedResult<ClashLeaderboardItem> | undefined) => {
    if (!current) {
      return current;
    }
    if (current.items.some((item) => item.creator?.id === participant.creator.id)) {
      return current;
    }
    return {
      ...current,
      items: [
        ...current.items,
        {
          rank: current.items.length + 1,
          points: 0,
          supportCount: 0,
          creator: participant.creator,
        },
      ],
    };
  };

  queryClient.setQueriesData({ queryKey: queryKeys.clashes.leaderboard(result.clash.id) }, seedLeaderboard);
  if (result.clash.slug !== result.clash.id) {
    queryClient.setQueriesData({ queryKey: queryKeys.clashes.leaderboard(result.clash.slug) }, seedLeaderboard);
  }
}

export function useJoinClash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: JoinClashInput) => {
      const parsed = joinClashSchema.parse(input);
      return joinClash(parsed.clashId, {
        username: parsed.username,
        platform: parsed.platform,
      });
    },
    onSuccess: (result, input) => {
      seedJoinedClashCaches(queryClient, result, input.username);
      void invalidateJoinClashQueries(queryClient, {
        username: input.username,
        clashId: result.clash.id,
        clashSlug: result.clash.slug,
      });
    },
  });
}
