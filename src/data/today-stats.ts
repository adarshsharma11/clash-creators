import { currentBattle } from "@/data/battles";
import type { TodayStats } from "@/types/today-stats";

function getTodaySupportPoints(): number {
  return currentBattle.entries.reduce((sum, entry) => sum + entry.supportPoints, 0);
}

export const todayStats = {
  activeCreators: currentBattle.entries.length,
  supportPoints: getTodaySupportPoints(),
} as const satisfies TodayStats;
