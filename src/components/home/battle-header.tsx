"use client";

import { useCountdown } from "@/hooks/use-countdown";
import type { Battle } from "@/types/battle";
import { StatusBadge } from "@/components/ui/status-badge";
import { Clock } from "lucide-react";

interface BattleHeaderProps {
  battle: Battle;
}

export function BattleHeader({ battle }: BattleHeaderProps) {
  const time = useCountdown(battle.endsAt);

  return (
    <div className="mb-10" id="explore">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <StatusBadge status={battle.status ?? "LIVE"} />
            <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Leaderboard</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">{battle.title}</h2>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            Ends in
          </span>
          <p className="mt-1 font-mono text-2xl font-bold tabular-nums text-foreground">
            {time.isExpired ? (
              <span className="text-destructive">ENDED</span>
            ) : (
              <>
                {time.hours.toString().padStart(2, "0")}:
                {time.minutes.toString().padStart(2, "0")}:
                {time.seconds.toString().padStart(2, "0")}
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
