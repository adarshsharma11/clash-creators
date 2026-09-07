"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Creator } from "@/types/creator";
import type { SupportRankPreview } from "@/types/support";
import { AnimatedPoints } from "./animated-points";

interface SupportSummaryProps {
  creator: Creator;
  amount: number | null;
  preview: SupportRankPreview | null;
}

export function SupportSummary({ creator, amount, preview }: SupportSummaryProps) {
  const reduceMotion = useReducedMotion();

  if (!amount) {
    return (
      <section className="rounded-3xl border border-dashed border-border/50 p-6">
        <h3 className="mb-2 text-lg font-bold">Your Support</h3>
        <p className="text-sm text-muted-foreground">
          Choose a support amount to see how it moves @{creator.username}.
        </p>
      </section>
    );
  }

  return (
    <motion.section
      layout
      className="rounded-3xl border border-border/50 bg-card/50 p-6"
      aria-live="polite"
    >
      <h3 className="mb-4 text-lg font-bold">Your Support</h3>
      <dl className="space-y-3 text-sm">
        <SummaryRow label="Creator" value={`@${creator.username}`} />
        <SummaryRow
          label="Support"
          value={
            <AnimatedPoints
              value={amount}
              prefix="+"
              className="font-mono font-bold text-primary"
            />
          }
        />
        {preview ? (
          <>
            <SummaryRow label="Current Position" value={`#${preview.currentRank}`} />
            <SummaryRow
              label="Current Support"
              value={<AnimatedPoints value={preview.currentSupport} className="font-mono" />}
            />
            <SummaryRow
              label="After Support"
              value={
                <AnimatedPoints
                  value={preview.afterSupport}
                  className="font-mono font-bold text-foreground"
                />
              }
            />
            <div className="flex items-center justify-between gap-4 border-t border-border/40 pt-3">
              <dt className="text-muted-foreground">Distance to #1</dt>
              <dd className="font-semibold">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={preview.becomesFirst || preview.remainsFirst ? "lead" : preview.afterDistanceToFirst}
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {preview.becomesFirst || preview.remainsFirst
                      ? "Leading"
                      : `${preview.afterDistanceToFirst.toLocaleString()} Points`}
                  </motion.span>
                </AnimatePresence>
              </dd>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Rank preview appears when this creator is in a live clash.
          </p>
        )}
      </dl>
    </motion.section>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
