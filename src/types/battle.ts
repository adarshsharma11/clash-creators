import type { Creator } from "@/types/creator";

export type BattleStatus = "scheduled" | "live" | "ending" | "completed";

export type BattleEntry = {
  creator: Creator;
  rank: number;
  supportPoints: number;
  previousRank?: number;
};

export type Battle = {
  id: string;
  slug?: string;
  title: string;
  status: BattleStatus;
  startsAt: string;
  endsAt: string;
  entries: BattleEntry[];
  region?: string;
  summary: string;
};
