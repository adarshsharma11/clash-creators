"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { BattleEntry } from "@/types/battle";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { BattleStatusIndicator } from "@/components/clash/battle-status-indicator";
import { AnimatedPoints } from "@/components/support/animated-points";
import { ChevronDown, ChevronUp, Minus } from "lucide-react";
import type { BattleStatus } from "@/types/battle";

interface AboutHeroProps {
  clashHref: string;
  clashTitle: string;
  clashStatus: BattleStatus;
  topEntries: BattleEntry[];
}

export function AboutHero({
  clashHref,
  clashTitle,
  clashStatus,
  topEntries,
}: AboutHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-border/40 px-4 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,transparent)]" />

      <div className="container relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-primary">
            About ClashCreators
          </p>
          <h1 className="mb-5 max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            What happens when creators compete?
          </h1>
          <p className="mb-8 max-w-lg text-lg text-muted-foreground">
            ClashCreators turns creator competition into live public battles where
            supporters help their favorites climb the leaderboard.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6 font-bold">
              <Link href="/#creators">Explore Creators</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-6 font-bold">
              <Link href={clashHref}>View Clashes</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="rounded-3xl border border-border/50 bg-card/60 p-5 sm:p-6"
          aria-label={`Live preview of ${clashTitle}`}
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {clashTitle}
              </p>
              <p className="text-sm text-muted-foreground">Public leaderboard</p>
            </div>
            <BattleStatusIndicator status={clashStatus} />
          </div>

          <ol className="space-y-3">
            {topEntries.map((entry, index) => {
              const movement = (entry.previousRank ?? entry.rank) - entry.rank;

              return (
                <motion.li
                  key={entry.creator.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.16 + index * 0.06 }}
                  className="flex items-center gap-3 rounded-2xl border border-border/40 bg-background/50 px-3 py-3"
                >
                  <span className="w-8 font-mono text-lg font-black text-primary">
                    #{entry.rank}
                  </span>
                  <Avatar
                    src={entry.creator.avatarUrl}
                    alt={entry.creator.displayName}
                    className="h-10 w-10"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">@{entry.creator.username}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {movement > 0 ? (
                        <ChevronUp className="h-3 w-3 text-emerald-400" />
                      ) : movement < 0 ? (
                        <ChevronDown className="h-3 w-3 text-red-400" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                      <span>{entry.creator.displayName}</span>
                    </div>
                  </div>
                  <AnimatedPoints
                    value={entry.supportPoints}
                    className="font-mono text-sm font-bold text-primary sm:text-base"
                  />
                </motion.li>
              );
            })}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}
