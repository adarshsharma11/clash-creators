"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ApiRetryButton } from "@/components/ui/api-status-panel";
import { participantLabel } from "@/lib/join-clash-flow";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { ClashListItem } from "@/types/clash";

interface TodayClashCardProps {
  clash: ClashListItem | null;
  clashHref: string;
  supportPoints: number;
  isLoading?: boolean;
  isError?: boolean;
  isRetrying?: boolean;
  onRetry?: () => void;
}

export function TodayClashCard({
  clash,
  clashHref,
  supportPoints,
  isLoading = false,
  isError = false,
  isRetrying = false,
  onRetry,
}: TodayClashCardProps) {
  const reduceMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div
        className="rounded-2xl border border-border/40 bg-card/50 p-5"
        aria-busy="true"
        aria-label="Loading today's clash"
      >
        <div className="skeleton-surface mb-4 h-3 w-28 rounded-full" />
        <div className="skeleton-surface mb-2 h-6 w-48 rounded-md" />
        <div className="skeleton-surface mb-6 h-4 w-24 rounded-md" />
        <div className="skeleton-surface h-11 w-full rounded-md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card/50 p-5" role="alert">
        <p className="text-sm font-semibold">Today&apos;s clash is unavailable.</p>
        {onRetry ? <ApiRetryButton onRetry={onRetry} isRetrying={isRetrying} /> : null}
      </div>
    );
  }

  if (!clash) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card/50 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Today&apos;s Clash</p>
        <p className="mt-3 font-semibold">No clash is open right now.</p>
        <p className="mt-1 text-sm text-muted-foreground">Check back soon for the next creator battle.</p>
      </div>
    );
  }

  const live = clash.status === "LIVE";

  return (
    <motion.aside
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.35, delay: reduceMotion ? 0 : 0.12 }}
      className="rounded-2xl border border-border/40 bg-card/50 p-5"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Today&apos;s Clash</p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold tracking-tight">{clash.title}</h2>
          {clash.category ? <p className="mt-1 text-sm text-muted-foreground">{clash.category.name}</p> : null}
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
            live ? "bg-orange-500/15 text-orange-400" : "bg-primary/12 text-primary"
          )}
        >
          {live ? <span className="h-1.5 w-1.5 rounded-full bg-orange-400" aria-hidden="true" /> : null}
          {live ? "Live now" : clash.status === "UPCOMING" ? "Up next" : clash.status}
        </span>
      </div>
      <dl className="mt-5 space-y-1 text-sm text-muted-foreground">
        <div className="flex justify-between gap-4">
          <dt>Creators</dt>
          <dd className="font-semibold text-foreground">
            {participantLabel(clash.participantCount, clash.maxParticipants)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Support</dt>
          <dd className="font-semibold text-foreground">{formatNumber(supportPoints)} support points</dd>
        </div>
      </dl>
      <Button asChild variant="outline" className="mt-5 h-11 w-full font-semibold">
        <Link href={clashHref}>Watch Clash</Link>
      </Button>
    </motion.aside>
  );
}
