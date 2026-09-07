"use client";

import { motion, useReducedMotion } from "motion/react";
import type { HallOfFameWinner } from "@/types/winner";
import { Avatar } from "@/components/ui/avatar";
import { formatPoints } from "@/lib/formatters";
import Link from "next/link";
import { Trophy } from "lucide-react";

interface WinnersPreviewProps {
  winners: HallOfFameWinner[];
  title?: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function WinnersPreview({
  winners,
  title = "Recent Champions",
  description,
  ctaHref,
  ctaLabel,
}: WinnersPreviewProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-t border-border/40 py-20" id="winners">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-amber-500">
            <Trophy className="h-5 w-5" />
            <h3 className="text-xl font-bold uppercase tracking-widest">Hall of Fame</h3>
          </div>
          <h4 className="text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h4>
          {description ? <p className="mt-3 max-w-xl text-muted-foreground">{description}</p> : null}
        </div>
        {ctaHref && ctaLabel ? (
          <Link href={ctaHref} className="text-sm font-semibold text-primary hover:text-primary/80">
            {ctaLabel}
          </Link>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">Latest daily champions</span>
        )}
      </div>

      {winners.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 px-6 py-12 text-center text-sm text-muted-foreground">
          Champions will appear here after clashes complete.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {winners.map((winner, index) => (
            <motion.div
              key={winner.id}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : Math.min(index * 0.06, 0.3) }}
              className="flex flex-col rounded-2xl border border-amber-500/20 bg-card p-6"
            >
              <div className="mb-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <span>{winner.date}</span>
                {winner.categoryName ? <span>{winner.categoryName}</span> : null}
              </div>

              <Link href={`/creators/${winner.creator.username}`} className="group mb-5 flex items-center gap-4">
                <Avatar
                  src={winner.creator.avatarUrl}
                  alt={winner.creator.displayName}
                  fallback={winner.creator.displayName}
                  className="h-16 w-16 border-2 border-amber-500/50"
                />
                <div className="min-w-0">
                  <div className="truncate font-bold group-hover:text-primary">{winner.creator.displayName}</div>
                  <div className="truncate text-sm text-muted-foreground">@{winner.creator.username}</div>
                </div>
              </Link>

              <div className="mt-auto space-y-3 border-t border-border/40 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold tabular-nums text-amber-500">
                    {formatPoints(winner.supportPoints)}
                  </span>
                  <span className="rounded bg-secondary px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Winner
                  </span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link href={`/creators/${winner.creator.username}`} className="font-semibold text-primary hover:text-primary/80">
                    View creator
                  </Link>
                  {winner.clashSlug ? (
                    <Link href={`/clash/${winner.clashSlug}`} className="font-semibold text-muted-foreground hover:text-foreground">
                      View clash
                    </Link>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
