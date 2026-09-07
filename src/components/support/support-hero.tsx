"use client";

import { motion, useReducedMotion } from "motion/react";
import type { Creator } from "@/types/creator";

interface SupportHeroProps {
  creator: Creator;
}

export function SupportHero({ creator }: SupportHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-10 max-w-2xl"
    >
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-primary">
        Support your creator
      </p>
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Help @{creator.username} take the crown.
      </h1>
      <p className="text-lg text-muted-foreground">
        Every support point moves them closer to #1.
      </p>
    </motion.header>
  );
}
