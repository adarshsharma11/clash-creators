"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { BattleEntry } from "@/types/battle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatPoints, formatNumber } from "@/lib/formatters";
import { ChevronUp, ChevronDown, Minus, Flame } from "lucide-react";

interface LeaderboardRowProps {
  entry: BattleEntry;
  nextEntry?: BattleEntry;
  maxPoints: number;
  index: number;
}

export function LeaderboardRow({ entry, nextEntry, maxPoints, index }: LeaderboardRowProps) {
  const rankChange = (entry.previousRank || entry.rank) - entry.rank;
  const distanceToNext = nextEntry ? nextEntry.supportPoints - entry.supportPoints : 0;
  
  const isTopThree = entry.rank <= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      className="group relative"
    >
      <div className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
        isTopThree 
          ? 'bg-card/80 border-border/60 hover:border-primary/50' 
          : 'bg-card/40 border-border/30 hover:bg-card hover:border-border/60'
      }`}>
        
        {/* Rank & Movement */}
        <div className="flex items-center gap-3 min-w-[60px]">
          <div className={`font-mono text-xl md:text-2xl font-black ${
            entry.rank === 1 ? 'text-amber-400' :
            entry.rank === 2 ? 'text-slate-300' :
            entry.rank === 3 ? 'text-amber-700' :
            'text-muted-foreground'
          }`}>
            #{entry.rank}
          </div>
          <div className="flex flex-col items-center">
            {entry.previousRank === undefined ? null : rankChange > 0 ? (
              <ChevronUp className="h-4 w-4 text-green-500" />
            ) : rankChange < 0 ? (
              <ChevronDown className="h-4 w-4 text-red-500" />
            ) : (
              <Minus className="h-4 w-4 text-muted-foreground/50" />
            )}
            {rankChange !== 0 && (
              <span className="text-[10px] font-bold text-muted-foreground">{Math.abs(rankChange)}</span>
            )}
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Link href={`/creators/${entry.creator.username}`} className="flex items-center gap-3 w-full group/link">
            <Avatar 
              src={entry.creator.avatarUrl ?? undefined}
              alt={entry.creator.displayName}
              fallback={entry.creator.displayName}
              className={`transition-transform duration-300 group-hover/link:scale-105 ${
                isTopThree ? 'h-12 w-12 sm:h-14 sm:w-14' : 'h-10 w-10 sm:h-12 sm:w-12'
              }`}
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold truncate text-base sm:text-lg text-foreground group-hover/link:text-primary transition-colors">
                  {entry.creator.displayName}
                </span>
                {entry.creator.verified && (
                  <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center rounded-full bg-blue-500 text-white">
                    ✓
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground truncate">
                <span>@{entry.creator.username}</span>
                {entry.creator.category ? (
                  <>
                    <span className="hidden sm:inline">&bull;</span>
                    <span className="hidden sm:inline">{entry.creator.category}</span>
                  </>
                ) : null}
                {typeof entry.creator.followers === "number" ? (
                  <>
                    <span className="hidden sm:inline">&bull;</span>
                    <span className="hidden sm:inline">{formatNumber(entry.creator.followers)} fans</span>
                  </>
                ) : null}
              </div>
            </div>
          </Link>
        </div>

        {/* Stats & Support */}
        <div className="flex flex-col sm:items-end w-full sm:w-auto gap-3 sm:gap-1 mt-2 sm:mt-0">
          <div className="flex sm:flex-col items-center sm:items-end justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg sm:text-xl font-bold tracking-tighter">
                {formatPoints(entry.supportPoints)}
              </span>
              <span className="text-xs text-muted-foreground uppercase font-semibold">Support</span>
            </div>
            
            {entry.rank === 1 ? (
              <div className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                Current Leader
              </div>
            ) : distanceToNext > 0 ? (
              <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Flame className="h-3 w-3 text-orange-500" />
                <span>{formatPoints(distanceToNext)} to #{entry.rank - 1}</span>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-[200px] mt-1 sm:mt-2">
            <Progress 
              value={entry.supportPoints} 
              max={maxPoints} 
              className="flex-1 h-2 bg-secondary/50"
              indicatorClassName={
                entry.rank === 1 ? 'bg-amber-400' :
                entry.rank === 2 ? 'bg-slate-300' :
                entry.rank === 3 ? 'bg-amber-700' :
                'bg-primary'
              }
            />
            <Button asChild size="sm" className="shrink-0">
              <Link href={`/support/${entry.creator.username}`}>Support</Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
