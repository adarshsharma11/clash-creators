"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePrefetchCreator } from "@/hooks/queries/use-creators";
import { formatPoints } from "@/lib/formatters";
import { isPrimarySocialVerified } from "@/lib/clash-view";
import type { CreatorListItem } from "@/types/creator";

interface CreatorCardProps {
  creator: CreatorListItem;
  index: number;
}

export function CreatorCard({ creator, index }: CreatorCardProps) {
  const reduceMotion = useReducedMotion();
  const prefetchCreator = usePrefetchCreator();
  const verified = isPrimarySocialVerified(creator.socialAccounts);
  const primarySocial = creator.socialAccounts.find((account) => account.isPrimary);

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.3, delay: reduceMotion ? 0 : Math.min(index * 0.03, 0.3) }}
      className="flex h-full flex-col rounded-2xl border border-border/50 bg-card/40 p-5"
    >
      <Link
        href={`/creators/${creator.username}`}
        onMouseEnter={() => prefetchCreator(creator.username)}
        onFocus={() => prefetchCreator(creator.username)}
        className="mb-4 flex items-center gap-4"
      >
        <Avatar
          src={creator.avatarUrl}
          alt={creator.displayName}
          fallback={creator.displayName}
          className="h-14 w-14"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate font-bold">{creator.displayName}</h2>
            {verified ? (
              <Badge
                variant="secondary"
                className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 p-0 text-[10px] text-white"
              >
                <span className="sr-only">Verified</span>✓
              </Badge>
            ) : null}
          </div>
          <p className="truncate text-sm text-muted-foreground">@{creator.username}</p>
        </div>
      </Link>

      <div className="mb-4 flex flex-wrap gap-2">
        {creator.category ? (
          <Badge variant="outline" className="font-medium">
            {creator.category.name}
          </Badge>
        ) : null}
        {primarySocial ? (
          <Badge variant="secondary" className="font-medium">
            {primarySocial.platform}
          </Badge>
        ) : null}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
        <div>
          <div className="font-mono text-lg font-bold tabular-nums text-primary">
            {formatPoints(creator.supportTotals.points)}
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Points
          </div>
        </div>
        <div>
          <div className="text-lg font-bold tabular-nums">{creator.clashStatistics.wins}</div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Wins
          </div>
        </div>
      </div>

      <Button asChild className="mt-auto h-11 w-full bg-primary font-bold text-primary-foreground">
        <Link href={`/support/${creator.username}`}>Support Creator</Link>
      </Button>
    </motion.div>
  );
}
