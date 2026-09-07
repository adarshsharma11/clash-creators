"use client";

import { motion, useReducedMotion } from "motion/react";
import { AnimatedPoints } from "@/components/support/animated-points";
import type { TodayStats } from "@/types/today-stats";

interface TodayCounterProps {
  stats: TodayStats;
}

export function TodayCounter({ stats }: TodayCounterProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.22 }}
      className="w-full max-w-xl border-y border-border/50 py-6 sm:border sm:rounded-3xl sm:bg-card/40 sm:px-8 sm:py-7"
    >
      <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.28em] text-muted-foreground">
        Today&apos;s Clash
      </p>
      <div className="grid grid-cols-2 divide-x divide-border/50">
        <div className="px-4 text-center sm:px-6">
          <p className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            <AnimatedPoints value={stats.activeCreators} />
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Creators
          </p>
        </div>
        <div className="px-4 text-center sm:px-6">
          <p className="text-4xl font-black tracking-tight text-primary sm:text-5xl">
            <AnimatedPoints value={stats.supportPoints} />
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Support Points
          </p>
        </div>
      </div>
    </motion.div>
  );
}
