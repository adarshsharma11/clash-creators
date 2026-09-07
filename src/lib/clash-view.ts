import type { Battle, BattleEntry, BattleStatus } from "@/types/battle";
import type {
  ClashCreatorRef,
  ClashDetail,
  ClashLeaderboardItem,
  ClashListItem,
  ClashParticipant,
  ClashStatus,
} from "@/types/clash";
import type { Creator, CreatorDetail, CreatorListItem, CreatorSocialAccount } from "@/types/creator";

const ENDING_WINDOW_MS = 15 * 60 * 1000;

export function toBattleStatus(status: ClashStatus, endsAt: string): BattleStatus {
  if (status === "COMPLETED" || status === "CANCELLED") {
    return "completed";
  }

  if (status === "LIVE") {
    const remaining = new Date(endsAt).getTime() - Date.now();
    if (remaining > 0 && remaining < ENDING_WINDOW_MS) {
      return "ending";
    }

    return "live";
  }

  return "scheduled";
}

export function creatorAvatarUrl(creator: ClashCreatorRef): string | null {
  return creator.avatarUrl ?? creator.user.avatarUrl;
}

export function isPrimarySocialVerified(accounts: CreatorSocialAccount[]): boolean {
  return accounts.some((account) => account.isPrimary && account.isVerified);
}

export function toCreatorFromDetail(creator: CreatorDetail): Creator {
  return {
    id: creator.id,
    username: creator.user.username,
    displayName: creator.displayName,
    avatarUrl: creator.avatarUrl ?? creator.user.avatarUrl,
    category: creator.category?.name,
    verified: isPrimarySocialVerified(creator.socialAccounts),
    bio: creator.bio,
  };
}

export function toCreatorFromListItem(creator: CreatorListItem): Creator {
  return {
    id: creator.id,
    username: creator.username,
    displayName: creator.displayName,
    avatarUrl: creator.avatarUrl,
    category: creator.category?.name,
    verified: isPrimarySocialVerified(creator.socialAccounts),
    bio: creator.bio,
  };
}

export function toBattleEntryFromLeaderboard(item: ClashLeaderboardItem): BattleEntry | null {
  if (!item.creator) {
    return null;
  }

  return {
    rank: item.rank,
    supportPoints: item.points,
    creator: {
      id: item.creator.id,
      username: item.creator.user.username,
      displayName: item.creator.displayName,
      avatarUrl: creatorAvatarUrl(item.creator),
    },
  };
}

export function toBattleEntryFromParticipant(participant: ClashParticipant): BattleEntry | null {
  if (participant.rank === null) {
    return null;
  }

  return {
    rank: participant.rank,
    supportPoints: participant.points,
    creator: {
      id: participant.creator.id,
      username: participant.creator.user.username,
      displayName: participant.creator.displayName,
      avatarUrl: creatorAvatarUrl(participant.creator),
    },
  };
}

export function leaderboardToEntries(items: ClashLeaderboardItem[]): BattleEntry[] {
  return items
    .map(toBattleEntryFromLeaderboard)
    .filter((entry): entry is BattleEntry => entry !== null)
    .sort((left, right) => left.rank - right.rank);
}

export function participantsToEntries(participants: ClashParticipant[]): BattleEntry[] {
  return participants
    .map(toBattleEntryFromParticipant)
    .filter((entry): entry is BattleEntry => entry !== null)
    .sort((left, right) => left.rank - right.rank);
}

export function toBattleView(
  clash: Pick<ClashListItem, "id" | "slug" | "title" | "description" | "status" | "startsAt" | "endsAt" | "category">,
  entries: BattleEntry[]
): Battle {
  return {
    id: clash.id,
    slug: clash.slug,
    title: clash.title,
    status: toBattleStatus(clash.status, clash.endsAt),
    startsAt: clash.startsAt,
    endsAt: clash.endsAt,
    entries,
    summary: clash.description ?? "",
    region: clash.category?.name,
  };
}

export function toBattleFromDetail(clash: ClashDetail, entries?: BattleEntry[]): Battle {
  return toBattleView(clash, entries ?? participantsToEntries(clash.participants));
}
