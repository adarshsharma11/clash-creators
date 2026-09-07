import type { Battle, BattleEntry } from "@/types/battle";
import { creators } from "./creators";
import { CURRENT_BATTLE_ID } from "./constants";

// Generate deterministic support points for the dummy entries
const generateSupportPoints = (rank: number) => {
  const basePoints = 20000;
  // Non-linear dropoff for a realistic leaderboard curve
  return Math.floor(basePoints / (Math.pow(rank, 1.2))) + (20 - rank) * 150;
};

// Create entries from our dummy creators and sort them by support points
const entries: BattleEntry[] = creators.map((creator, index) => {
  const rank = index + 1;
  const supportPoints = generateSupportPoints(rank);
  
  return {
    creator,
    rank,
    supportPoints,
    // Add some random-looking but deterministic movement for top creators
    previousRank: rank > 3 ? rank : (rank === 1 ? 2 : (rank === 2 ? 1 : 3)),
  };
}).sort((a, b) => b.supportPoints - a.supportPoints);

// Re-assign exact ranks after sorting (though they should already be in order)
entries.forEach((entry, index) => {
  entry.rank = index + 1;
});

export const currentBattle: Battle = {
  id: CURRENT_BATTLE_ID,
  title: "Gaming × Global",
  status: "live",
  startsAt: "2026-09-06T18:00:00.000Z",
  endsAt: "2026-09-08T12:30:00.000Z",
  entries,
  region: "Global",
  summary: "The ultimate showdown of top gaming creators worldwide.",
};

export function getBattleById(id: string): Battle | undefined {
  return id === currentBattle.id ? currentBattle : undefined;
}

export function getActiveBattleForCreator(creatorId: string): Battle | undefined {
  const isActive = currentBattle.status === "live" || currentBattle.status === "ending";
  if (!isActive) {
    return undefined;
  }

  const isParticipating = currentBattle.entries.some((entry) => entry.creator.id === creatorId);
  return isParticipating ? currentBattle : undefined;
}

export function getBattleEntryForCreator(
  battle: Battle,
  creatorId: string
): BattleEntry | undefined {
  return battle.entries.find((entry) => entry.creator.id === creatorId);
}
