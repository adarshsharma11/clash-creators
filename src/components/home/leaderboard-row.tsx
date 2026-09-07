"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { BattleEntry } from "@/types/battle";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { creatorHandleLabel, creatorProfilePath, creatorSupportPath } from "@/lib/clash-view";
import { formatPoints, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, Minus, Flame } from "lucide-react";

interface LeaderboardRowProps {
  entry: BattleEntry;
  nextEntry?: BattleEntry;
  maxPoints: number;
  index: number;
  highlighted?: boolean;
}

export function LeaderboardRow({
  entry,
  nextEntry,
  maxPoints,
  index,
  highlighted = false,
}: LeaderboardRowProps) {
  const reduceMotion = useReducedMotion();
  const rankChange = (entry.previousRank || entry.rank) - entry.rank;
  const distanceToNext = nextEntry ? nextEntry.supportPoints - entry.supportPoints : 0;
  const isTopThree = entry.rank <= 3;
  const profileHref = creatorProfilePath(entry.creator.username);
  const supportHref = creatorSupportPath(entry.creator.username);
  const handle = creatorHandleLabel(entry.creator);
  const movementLabel =
    entry.previousRank === undefined
      ? "New"
      : rankChange > 0
        ? `Up ${Math.abs(rankChange)}`
        : rankChange < 0
          ? `Down ${Math.abs(rankChange)}`
          : "Unchanged";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.4) }}
      className="group relative"
    >
      <div
        className={cn(
          "relative flex flex-col gap-3 rounded-2xl border p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4",
          isTopThree ? "border-border/60 bg-card/80" : "border-border/30 bg-card/40",
          highlighted && "border-primary/50 bg-primary/8",
          "hover:border-primary/40"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 shrink-0 font-mono text-xl font-black tabular-nums sm:w-12 sm:text-2xl",
              entry.rank === 1 && "text-amber-400",
              entry.rank === 2 && "text-slate-300",
              entry.rank === 3 && "text-amber-700",
              entry.rank > 3 && "text-muted-foreground"
            )}
          >
            #{entry.rank}
          </div>
          <div className="flex w-6 flex-col items-center" aria-label={movementLabel}>
            {entry.previousRank === undefined ? null : rankChange > 0 ? (
              <ChevronUp className="h-4 w-4 text-green-500" aria-hidden="true" />
            ) : rankChange < 0 ? (
              <ChevronDown className="h-4 w-4 text-red-500" aria-hidden="true" />
            ) : (
              <Minus className="h-4 w-4 text-muted-foreground/50" aria-hidden="true" />
            )}
            {rankChange !== 0 ? (
              <span className="text-[10px] font-bold text-muted-foreground">{Math.abs(rankChange)}</span>
            ) : null}
          </div>

          {profileHref ? (
            <Link href={profileHref} className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar
                src={entry.creator.avatarUrl}
                alt={entry.creator.displayName}
                fallback={entry.creator.displayName}
                className={cn("h-11 w-11 shrink-0", isTopThree && "sm:h-12 sm:w-12")}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold">{entry.creator.displayName}</span>
                  {entry.creator.verified ? (
                    <Badge
                      variant="secondary"
                      className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 p-0 text-white"
                    >
                      <span className="sr-only">Verified</span>✓
                    </Badge>
                  ) : null}
                  {highlighted ? (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      You
                    </span>
                  ) : null}
                </div>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">@{handle}</p>
              </div>
            </Link>
          ) : (
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Avatar
                src={entry.creator.avatarUrl}
                alt={entry.creator.displayName}
                fallback={entry.creator.displayName}
                className={cn("h-11 w-11 shrink-0", isTopThree && "sm:h-12 sm:w-12")}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-bold">{entry.creator.displayName}</span>
                  {highlighted ? (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      You
                    </span>
                  ) : null}
                </div>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">@{handle}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 sm:ml-auto sm:w-auto sm:min-w-[220px] sm:flex-col sm:items-end">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold tabular-nums">{formatPoints(entry.supportPoints)}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Points</span>
            </div>
            {entry.rank === 1 ? (
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">Current #1</p>
            ) : distanceToNext > 0 ? (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Flame className="h-3 w-3 text-orange-500" aria-hidden="true" />
                {formatPoints(distanceToNext)} to #{entry.rank - 1}
              </p>
            ) : null}
            {typeof entry.creator.followers === "number" ? (
              <p className="hidden text-xs text-muted-foreground sm:block">{formatNumber(entry.creator.followers)} fans</p>
            ) : null}
          </div>
          <div className="flex w-[140px] items-center gap-2 sm:w-[200px]">
            <Progress
              value={entry.supportPoints}
              max={maxPoints}
              className="h-2 flex-1 bg-secondary/50"
              indicatorClassName={
                entry.rank === 1
                  ? "bg-amber-400"
                  : entry.rank === 2
                    ? "bg-slate-300"
                    : entry.rank === 3
                      ? "bg-amber-700"
                      : "bg-primary"
              }
            />
            {supportHref ? (
              <Button asChild size="sm" className="h-9 shrink-0 bg-primary text-primary-foreground">
                <Link href={supportHref}>Support</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
