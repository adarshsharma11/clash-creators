"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePrefetchCreator } from "@/hooks/queries/use-creators";
import { formatPoints } from "@/lib/formatters";
import { isPrimarySocialVerified } from "@/lib/clash-view";
import type { CreatorListItem } from "@/types/creator";

interface CreatorCardProps {
  creator: CreatorListItem;
  index: number;
}

export function CreatorCard({ creator, index }: CreatorCardProps) {
  const prefetchCreator = usePrefetchCreator();
  const verified = isPrimarySocialVerified(creator.socialAccounts);
  const primarySocial = creator.socialAccounts.find((account) => account.isPrimary);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
    >
      <Link
        href={`/creators/${creator.username}`}
        onMouseEnter={() => prefetchCreator(creator.username)}
        onFocus={() => prefetchCreator(creator.username)}
        className="group flex h-full flex-col rounded-2xl border border-border/50 bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-card"
      >
        <div className="mb-4 flex items-center gap-4">
          <Avatar
            src={creator.avatarUrl ?? undefined}
            alt={creator.displayName}
            fallback={creator.displayName}
            className="h-14 w-14 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate font-bold group-hover:text-primary">{creator.displayName}</h2>
              {verified ? (
                <Badge
                  variant="secondary"
                  className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 p-0 text-[10px] text-white"
                >
                  ✓
                </Badge>
              ) : null}
            </div>
            <p className="truncate text-sm text-muted-foreground">@{creator.username}</p>
          </div>
        </div>

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

        <div className="mt-auto grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="font-mono text-lg font-bold text-primary">
              {formatPoints(creator.supportTotals.points)}
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Support
            </div>
          </div>
          <div>
            <div className="text-lg font-bold">{creator.clashStatistics.wins}</div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Wins
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
