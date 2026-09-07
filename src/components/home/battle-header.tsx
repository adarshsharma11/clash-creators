"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { formatNumber } from "@/lib/formatters";
import type { Battle } from "@/types/battle";
import { StatusBadge } from "@/components/ui/status-badge";
import { Clock, Users, Trophy } from "lucide-react";

interface BattleHeaderProps {
  battle: Battle;
}

export function BattleHeader({ battle }: BattleHeaderProps) {
  const time = useCountdown(battle.endsAt);
  const totalSupport = battle.entries.reduce((sum, entry) => sum + entry.supportPoints, 0);

  return (
    <div className="mb-12" id="explore">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <StatusBadge status={battle.status ?? "LIVE"} />
            <span className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Today&apos;s Clash</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
            {battle.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {battle.summary} Who owns the crown?
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:gap-8 bg-card border border-border/50 rounded-2xl p-4 md:p-6 shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Clock className="h-3 w-3" /> Ends In
            </span>
            <div className="text-2xl md:text-3xl font-bold font-mono tabular-nums tracking-tighter text-foreground">
              {time.isExpired ? (
                <span className="text-destructive">ENDED</span>
              ) : (
                <>
                  {time.hours.toString().padStart(2, "0")}:
                  {time.minutes.toString().padStart(2, "0")}:
                  {time.seconds.toString().padStart(2, "0")}
                </>
              )}
            </div>
          </div>
          
          <div className="h-10 w-px bg-border hidden sm:block"></div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Users className="h-3 w-3" /> Creators
            </span>
            <div className="text-xl md:text-2xl font-bold text-foreground">
              {battle.entries.length}
            </div>
          </div>
          
          <div className="h-10 w-px bg-border hidden sm:block"></div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
              <Trophy className="h-3 w-3" /> Support
            </span>
            <div className="text-xl md:text-2xl font-bold text-primary">
              {formatNumber(totalSupport)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
