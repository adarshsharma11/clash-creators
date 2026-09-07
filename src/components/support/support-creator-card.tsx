"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Creator } from "@/types/creator";
import type { BattleEntry } from "@/types/battle";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCountry, formatPoints } from "@/lib/formatters";

interface SupportCreatorCardProps {
  creator: Creator;
  entry: BattleEntry | null;
  distanceToFirst: number;
}

export function SupportCreatorCard({
  creator,
  entry,
  distanceToFirst,
}: SupportCreatorCardProps) {
  const reduceMotion = useReducedMotion();
  const isLeader = entry?.rank === 1;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.05 }}
      aria-label="Creator summary"
      className="rounded-3xl border border-border/50 bg-card/70 p-8 text-center"
    >
      <Avatar
        src={creator.avatarUrl ?? undefined}
        alt={creator.displayName}
        fallback={creator.displayName}
        className="mx-auto mb-5 h-24 w-24 ring-2 ring-primary/20"
      />

      <div className="mb-1 flex items-center justify-center gap-2 text-sm font-bold text-muted-foreground">
        @{creator.username}
        {creator.verified && (
          <Badge
            variant="secondary"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 p-0 text-[10px] text-white"
          >
            ✓
          </Badge>
        )}
      </div>

      <h2 className="mb-2 text-2xl font-extrabold tracking-tight">{creator.displayName}</h2>
      {creator.category || creator.country ? (
        <p className="mb-6 text-sm text-muted-foreground">
          {[creator.category, creator.country ? formatCountry(creator.country) : null]
            .filter((value): value is string => Boolean(value))
            .join(" · ")}
        </p>
      ) : (
        <div className="mb-6" />
      )}

      {entry ? (
        <div className="space-y-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Today&apos;s Clash
            </div>
            <div className="text-3xl font-black">#{entry.rank}</div>
          </div>
          <div className="font-mono text-lg font-bold text-primary">
            {formatPoints(entry.supportPoints)} Support
          </div>
          {isLeader ? (
            <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-sm font-bold text-amber-500">
              👑 CURRENT LEADER
            </div>
          ) : (
            <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-sm font-bold text-orange-400">
              🔥 {formatPoints(distanceToFirst)} to #1
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Not competing in a live clash right now.</p>
      )}
    </motion.section>
  );
}
