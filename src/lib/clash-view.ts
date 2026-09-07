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

export function resolveCreatorUsername(creator: {
  username?: string | null;
  displayName?: string | null;
  user?: { username?: string | null } | null;
}): string {
  return creator.user?.username?.trim() || creator.username?.trim() || "";
}

export function creatorAvatarUrl(creator: ClashCreatorRef): string | null {
  return creator.avatarUrl ?? creator.user?.avatarUrl ?? null;
}

export function isPrimarySocialVerified(accounts: CreatorSocialAccount[]): boolean {
  return accounts.some((account) => account.isPrimary && account.isVerified);
}

export function toCreatorFromDetail(creator: CreatorDetail): Creator {
  return {
    id: creator.id,
    username: creator.user?.username ?? "",
    displayName: creator.displayName,
    avatarUrl: creator.avatarUrl ?? creator.user?.avatarUrl ?? null,
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

export function creatorHandleLabel(creator: { username?: string | null; displayName?: string | null }): string {
  return creator.username?.trim() || creator.displayName?.trim() || "creator";
}

export function creatorProfilePath(username: string | null | undefined): string | null {
  const handle = username?.trim();
  return handle ? `/creators/${handle}` : null;
}

export function creatorSupportPath(username: string | null | undefined): string | null {
  const handle = username?.trim();
  return handle ? `/support/${handle}` : null;
}

function toBattleCreator(creator: ClashCreatorRef): Creator {
  return {
    id: creator.id,
    username: resolveCreatorUsername(creator),
    displayName: creator.displayName || resolveCreatorUsername(creator) || "Creator",
    avatarUrl: creatorAvatarUrl(creator),
  };
}

export function toBattleEntryFromLeaderboard(item: ClashLeaderboardItem): BattleEntry | null {
  if (!item.creator) {
    return null;
  }

  return {
    rank: item.rank || 0,
    supportPoints: item.points,
    creator: toBattleCreator(item.creator),
  };
}

export function toBattleEntryFromParticipant(
  participant: ClashParticipant,
  index = 0
): BattleEntry | null {
  if (!participant.creator) {
    return null;
  }

  return {
    rank: participant.rank ?? index + 1,
    supportPoints: participant.points,
    creator: toBattleCreator(participant.creator),
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
    .map((participant, index) => toBattleEntryFromParticipant(participant, index))
    .filter((entry): entry is BattleEntry => entry !== null)
    .sort((left, right) => left.rank - right.rank);
}

export function mergeBattleEntries(primary: BattleEntry[], extra: BattleEntry[]): BattleEntry[] {
  const byId = new Map<string, BattleEntry>();
  for (const entry of extra) {
    byId.set(entry.creator.id, entry);
  }
  for (const entry of primary) {
    byId.set(entry.creator.id, entry);
  }
  return [...byId.values()].sort((left, right) => {
    if (left.rank !== right.rank) {
      return left.rank - right.rank;
    }
    return left.creator.displayName.localeCompare(right.creator.displayName);
  });
}

export function clashEntriesFromSources(
  leaderboard: ClashLeaderboardItem[] | undefined,
  participants: ClashParticipant[] | undefined
): BattleEntry[] {
  return mergeBattleEntries(leaderboardToEntries(leaderboard ?? []), participantsToEntries(participants ?? []));
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
