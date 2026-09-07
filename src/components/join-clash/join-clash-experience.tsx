"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { JoinClashCard } from "@/components/clash/join-clash-card";

export function JoinClashExperience() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="container mx-auto max-w-xl px-4 py-12 sm:px-8 sm:py-16">
      <motion.header
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-primary">Join the Clash</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Enter the next battle</h1>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          Represent your community. Pick your platform. Join the clash.
        </p>
      </motion.header>
      <Suspense fallback={<div className="h-72 rounded-3xl border border-border/50 bg-card/30" />}>
        <JoinClashPageCard />
      </Suspense>
    </div>
  );
}

function JoinClashPageCard() {
  const searchParams = useSearchParams();
  const clashId = searchParams.get("clash") ?? undefined;

  return <JoinClashCard variant="page" clashId={clashId} />;
}
