"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { formatPoints } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Flame, Clock } from "lucide-react";
import Link from "next/link";

export type CurrentClashCardData = {
  title: string;
  slug: string;
  endsAt: string;
  rank: number | null;
  supportPoints: number;
  pointsToPrevious: number | null;
  previousRank: number | null;
  username: string;
};

interface CurrentClashCardProps {
  clash: CurrentClashCardData;
}

export function CurrentClashCard({ clash }: CurrentClashCardProps) {
  const time = useCountdown(clash.endsAt);
  const isLeader = clash.rank === 1;

  return (
    <section className="py-12">
      <div className="flex items-center gap-2 mb-6">
        <Flame className="h-5 w-5 text-orange-500" />
        <h2 className="text-2xl font-bold tracking-tight uppercase">Current Clash</h2>
      </div>

      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-primary/5 opacity-50"></div>
        
        <div className="relative z-10 mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            {clash.title}
          </p>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">
          <div className="flex-1 flex flex-col md:flex-row gap-6 md:gap-12">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Position</span>
              <div className="text-4xl font-black text-foreground">
                {clash.rank ? `#${clash.rank}` : "—"}
              </div>
            </div>
            
            <div className="hidden md:block h-16 w-px bg-border"></div>
            
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Support</span>
              <div className="text-3xl font-bold text-primary font-mono tracking-tighter">
                {formatPoints(clash.supportPoints)}
              </div>
            </div>
            
            <div className="hidden md:block h-16 w-px bg-border"></div>
            
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Status</span>
              {isLeader ? (
                <div className="text-xl font-bold text-amber-500 flex items-center gap-2">
                  👑 Current Leader
                </div>
              ) : clash.pointsToPrevious !== null && clash.previousRank !== null ? (
                <div className="flex flex-col">
                  <div className="text-xl font-bold text-foreground">
                    <span className="text-orange-500">{formatPoints(clash.pointsToPrevious)}</span> to #{clash.previousRank}
                  </div>
                </div>
              ) : (
                <div className="text-xl font-bold text-foreground">Competing</div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-4 lg:min-w-[200px]">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-1 lg:mb-2 justify-center lg:justify-start">
              <Clock className="h-4 w-4" />
              {time.isExpired ? (
                <span className="text-destructive">ENDED</span>
              ) : (
                <span className="font-mono">
                  {time.hours.toString().padStart(2, "0")}:{time.minutes.toString().padStart(2, "0")}:{time.seconds.toString().padStart(2, "0")} remaining
                </span>
              )}
            </div>
            
            <div className="flex gap-3 w-full">
              <Button asChild className="flex-1 h-12 font-bold bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={`/support/${clash.username}`}>Support Now</Link>
              </Button>
              <Button variant="outline" className="flex-1 h-12 font-bold" asChild>
                <Link href={`/clash/${clash.slug}`}>View Clash</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
