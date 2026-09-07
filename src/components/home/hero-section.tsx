"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { TodayStats } from "@/types/today-stats";
import { TodayCounter } from "./today-counter";

interface HeroSectionProps {
  clashHref: string;
  todayStats: TodayStats;
}

export function HeroSection({ clashHref, todayStats }: HeroSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />

      <div className="container relative z-10 mx-auto flex flex-col items-center px-4 text-center sm:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400"
        >
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span
              className={
                reduceMotion
                  ? "h-2 w-2 rounded-full bg-amber-400"
                  : "absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60"
              }
            />
            {!reduceMotion ? (
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            ) : null}
          </span>
          Live today
        </motion.div>

        <motion.h1
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="mb-5 max-w-4xl bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl"
        >
          Creators compete. Support decides today&apos;s winner.
        </motion.h1>

        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14 }}
          className="mb-10 max-w-xl text-lg text-muted-foreground md:text-xl"
        >
          ClashCreators is a daily creator battle. See who&apos;s live, who&apos;s #1, and support the creator you want to win.
        </motion.p>

        <TodayCounter stats={todayStats} />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex w-full max-w-lg flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button
            size="lg"
            className="h-12 w-full bg-primary px-8 text-base font-semibold text-primary-foreground sm:w-auto"
            asChild
          >
            <Link href="/join-clash">Join Clash</Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 w-full px-8 text-base font-semibold sm:w-auto" asChild>
            <Link href={clashHref}>View Clash</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
