import { currentBattle } from "@/data/battles";
import type { AdminClashRow } from "@/types/admin";

export function getAdminClashRows(): AdminClashRow[] {
  const top = currentBattle.entries[0];

  return [
    {
      id: currentBattle.id,
      title: currentBattle.title,
      status: currentBattle.status,
      creatorCount: currentBattle.entries.length,
      startsAt: currentBattle.startsAt,
      endsAt: currentBattle.endsAt,
      topCreatorUsername: top?.creator.username ?? null,
      topCreatorName: top?.creator.displayName ?? null,
    },
    {
      id: "fitness-week",
      title: "Fitness Battle",
      status: "live",
      creatorCount: 18,
      startsAt: "2026-09-07T00:00:00.000Z",
      endsAt: "2026-09-07T16:10:00.000Z",
      topCreatorUsername: "sarah_fitness",
      topCreatorName: "Sarah Jenkins",
    },
    {
      id: "ai-sprint",
      title: "AI Sprint",
      status: "scheduled",
      creatorCount: 12,
      startsAt: "2026-09-08T10:00:00.000Z",
      endsAt: "2026-09-08T22:00:00.000Z",
      topCreatorUsername: "ai_explorer",
      topCreatorName: "Dr. AI",
    },
    {
      id: "comedy-night",
      title: "Comedy Night",
      status: "completed",
      creatorCount: 16,
      startsAt: "2026-09-05T18:00:00.000Z",
      endsAt: "2026-09-06T06:00:00.000Z",
      topCreatorUsername: "mikemakesjokes",
      topCreatorName: "Mike Comedy",
    },
  ];
}
