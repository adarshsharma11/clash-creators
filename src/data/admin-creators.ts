import { currentBattle } from "@/data/battles";
import { creators } from "@/data/creators";
import type { AdminCreatorRow } from "@/types/admin";

const JOINED_AT: Record<string, string> = {
  c1: "2026-01-12",
  c2: "2026-02-03",
  c3: "2026-01-28",
  c4: "2026-03-14",
  c5: "2026-04-02",
  c6: "2026-02-19",
  c7: "2026-03-01",
  c8: "2026-04-11",
};

export function getAdminCreatorRows(): AdminCreatorRow[] {
  return creators.map((creator, index) => {
    const entry = currentBattle.entries.find((item) => item.creator.id === creator.id);

    return {
      id: creator.id,
      username: creator.username,
      displayName: creator.displayName,
      avatarUrl: creator.avatarUrl ?? "",
      category: creator.category ?? "Uncategorized",
      currentRank: entry?.rank ?? null,
      supportPoints: entry?.supportPoints ?? 0,
      status: index === 14 ? "suspended" : "active",
      joinedAt: JOINED_AT[creator.id] ?? "2026-05-01",
    };
  });
}
