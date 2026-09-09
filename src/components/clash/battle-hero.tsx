"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { formatNumber } from "@/lib/formatters";
import type { Battle } from "@/types/battle";
import { BattleStatusIndicator } from "./battle-status-indicator";
import { ShareButton } from "@/components/ui/share-button";
import { Clock, Users, Trophy } from "lucide-react";

interface BattleHeroProps {
  battle: Battle;
}

export function BattleHero({ battle }: BattleHeroProps) {
  const time = useCountdown(battle.endsAt);
  const totalSupport = battle.entries.reduce((sum, entry) => sum + entry.supportPoints, 0);

  return (
    <div className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BattleStatusIndicator status={battle.status} />
            <span className="text-sm font-bold tracking-wider text-muted-foreground uppercase hidden sm:inline">
              Creator of the Day
            </span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
            {battle.title}
          </h1>
          
          {battle.summary ? (
            <p className="mb-4 max-w-2xl text-xl text-primary md:text-2xl">
              {battle.summary}
            </p>
          ) : null}
          <p className="mb-12 text-base text-muted-foreground md:text-lg">
            Support a creator. 1 point = ₹1. First place when the timer ends wins.
          </p>

          <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 bg-card/60 backdrop-blur-sm border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-col items-center">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> 
                {battle.status === "completed" ? "Ended" : "Time Remaining"}
              </span>
              <div className="text-4xl md:text-5xl font-black font-mono tracking-tighter text-foreground">
                {time.isExpired ? (
                  <span className="text-destructive">00:00:00</span>
                ) : (
                  <>
                    {time.hours.toString().padStart(2, "0")}:
                    {time.minutes.toString().padStart(2, "0")}:
                    {time.seconds.toString().padStart(2, "0")}
                  </>
                )}
              </div>
            </div>
            
            <div className="h-px w-full md:h-20 md:w-px bg-border"></div>
            
            <div className="flex items-center gap-12">
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Users className="h-4 w-4" /> Creators
                </span>
                <div className="text-3xl md:text-4xl font-bold text-foreground">
                  {battle.entries.length}
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Trophy className="h-4 w-4" /> Support
                </span>
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {formatNumber(totalSupport)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <ShareButton 
              title={battle.title}
              text={`Check out the live creator battle: ${battle.title}`}
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
