import type { BattleEntry } from "@/types/battle";
import type { SupportRankPreview } from "@/types/support";

export function rankBattleEntries(entries: readonly BattleEntry[]): BattleEntry[] {
  return [...entries]
    .sort((a, b) => {
      if (b.supportPoints !== a.supportPoints) {
        return b.supportPoints - a.supportPoints;
      }

      return a.rank - b.rank;
    })
    .map((entry, index) => ({
      ...entry,
      previousRank: entry.rank,
      rank: index + 1,
    }));
}

export function applySupportToEntries(
  entries: readonly BattleEntry[],
  creatorId: string,
  amount: number
): BattleEntry[] {
  const nextEntries = entries.map((entry) =>
    entry.creator.id === creatorId
      ? { ...entry, supportPoints: entry.supportPoints + amount }
      : { ...entry }
  );

  return rankBattleEntries(nextEntries);
}

export function calculateRankAfterSupport(
  entries: readonly BattleEntry[],
  creatorId: string,
  amount: number
): SupportRankPreview | null {
  const current = entries.find((entry) => entry.creator.id === creatorId);

  if (!current) {
    return null;
  }

  const leader = entries.reduce((top, entry) =>
    entry.supportPoints > top.supportPoints ? entry : top
  );
  const isCurrentlyFirst = current.creator.id === leader.creator.id;
  const currentDistanceToFirst = isCurrentlyFirst
    ? 0
    : Math.max(0, leader.supportPoints - current.supportPoints);

  const ranked = applySupportToEntries(entries, creatorId, amount);
  const after = ranked.find((entry) => entry.creator.id === creatorId);

  if (!after) {
    return null;
  }

  const afterLeader = ranked[0];
  const afterDistanceToFirst =
    after.rank === 1 ? 0 : Math.max(0, afterLeader.supportPoints - after.supportPoints);

  return {
    currentRank: current.rank,
    currentSupport: current.supportPoints,
    afterSupport: after.supportPoints,
    afterRank: after.rank,
    currentDistanceToFirst,
    afterDistanceToFirst,
    isCurrentlyFirst,
    becomesFirst: after.rank === 1 && !isCurrentlyFirst,
    remainsFirst: after.rank === 1 && isCurrentlyFirst,
    rankImproved: after.rank < current.rank,
  };
}
