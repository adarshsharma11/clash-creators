"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

interface JoinClashSuccessProps {
  clashHref: string;
  creatorHref: string;
  clashTitle: string;
}

export function JoinClashSuccess({ clashHref, creatorHref, clashTitle }: JoinClashSuccessProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-border/50 bg-card/40 px-6 py-12 text-center sm:px-10"
    >
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-primary">
        You&apos;re in!
      </p>
      <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
        You&apos;re ready to Clash. 🔥
      </h2>
      <p className="mx-auto mb-8 max-w-md text-muted-foreground">
        You joined {clashTitle}. Support opens when the clash goes live.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="h-12 font-bold">
          <Link href={clashHref}>View Clash</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 font-bold">
          <Link href={creatorHref}>View Profile</Link>
        </Button>
      </div>
    </motion.div>
  );
}
