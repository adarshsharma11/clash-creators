"use client";

import { motion } from "motion/react";
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
  return (
    <section className="py-20 border-t border-border/40" id="winners">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 text-amber-500">
            <Trophy className="h-5 w-5" />
            <h3 className="text-xl font-bold uppercase tracking-widest">Hall of Fame</h3>
          </div>
          <h4 className="text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h4>
          {description ? (
            <p className="mt-3 max-w-xl text-muted-foreground">{description}</p>
          ) : null}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {winners.map((winner, index) => (
          <motion.div
            key={winner.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex flex-col p-6 rounded-2xl bg-card border border-border/50 hover:border-amber-500/30 transition-colors"
          >
            <div className="text-sm font-medium text-muted-foreground mb-4">
              {winner.date}
            </div>
            
            <Link href={`/creators/${winner.creator.username}`} className="flex items-center gap-4 mb-6 group">
              <Avatar
                src={winner.creator.avatarUrl ?? undefined}
                alt={winner.creator.displayName}
                fallback={winner.creator.displayName}
                className="h-16 w-16 border-2 border-amber-500/50"
              />
              <div>
                <div className="font-bold text-lg group-hover:text-primary transition-colors">{winner.creator.displayName}</div>
                <div className="text-sm text-muted-foreground">@{winner.creator.username}</div>
              </div>
            </Link>
            
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/40">
              <div className="font-mono font-bold text-amber-500">
                {formatPoints(winner.supportPoints)}
              </div>
              <div className="text-xs uppercase tracking-wider font-bold text-muted-foreground bg-secondary px-2 py-1 rounded">
                {winner.title}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}
    </section>
  );
}
