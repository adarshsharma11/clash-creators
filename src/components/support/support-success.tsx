"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Creator } from "@/types/creator";
import type { SupportRankPreview } from "@/types/support";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ui/share-button";
import { AnimatedPoints } from "./animated-points";

interface SupportSuccessProps {
  creator: Creator;
  amount: number;
  preview: SupportRankPreview | null;
  clashHref?: string;
  clashTitle?: string;
}

const sparks = [
  { x: -36, y: -58, delay: 0 },
  { x: 40, y: -70, delay: 0.06 },
  { x: -8, y: -86, delay: 0.12 },
];

export function SupportSuccess({
  creator,
  amount,
  preview,
  clashHref,
  clashTitle,
}: SupportSuccessProps) {
  const reduceMotion = useReducedMotion();
  const creatorHref = `/creators/${creator.username}`;

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-xl py-8 text-center"
    >
      <div role="status" aria-live="polite" aria-atomic="true">
        <div className="relative mb-8 flex justify-center">
          {!reduceMotion &&
            sparks.map((spark) => (
              <motion.span
                key={`${spark.x}-${spark.y}`}
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], scale: 1, x: spark.x, y: spark.y }}
                transition={{ duration: 0.9, delay: spark.delay }}
                className="absolute top-6 h-2 w-2 rounded-full bg-primary"
              />
            ))}
          <motion.div
            initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.55 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 text-4xl"
          >
            🎉
          </motion.div>
        </div>

        <h2 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Support confirmed!
        </h2>
        <p className="mb-2 text-lg text-muted-foreground">
          You supported {creator.displayName} (@{creator.username})
        </p>
        <p className={`font-mono text-4xl font-black text-primary ${clashTitle ? "mb-2" : "mb-8"}`}>
          +{amount.toLocaleString()} Support Points
        </p>
        {clashTitle ? (
          <p className="mb-8 text-sm font-medium text-muted-foreground">{clashTitle}</p>
        ) : null}

        {preview ? (
          <div className="mb-10 grid grid-cols-2 gap-4 text-left">
            <div className="rounded-2xl border border-border/40 bg-card/50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Their new total
              </div>
              <AnimatedPoints
                value={preview.afterSupport}
                className="font-mono text-2xl font-bold"
              />
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="rounded-2xl border border-border/40 bg-card/50 p-4">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Current Position
              </div>
              <motion.div
                key={preview.afterRank}
                initial={reduceMotion ? false : { y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-black"
              >
                #{preview.afterRank}
                {preview.afterRank === 1 ? " 👑" : ""}
              </motion.div>
            </div>
          </div>
        ) : (
          <p className="mb-10 text-muted-foreground">
            Your support is ready for the next clash.
          </p>
        )}
      </div>

      <p className="mb-4 text-sm font-medium text-muted-foreground">
        Help them reach the crown.
      </p>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <ShareButton
          url={creatorHref}
          title={`Support @${creator.username} on ClashCreators`}
          text={`Help @${creator.username} climb today's Clash.`}
          label={`Share @${creator.username}`}
          className="h-12 flex-1"
        />
        <ShareButton
          url={creatorHref}
          copyOnly
          label="Copy Link"
          className="h-12 flex-1"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {clashHref ? (
          <Button asChild size="lg" className="h-12 flex-1 font-bold">
            <Link href={clashHref}>View Clash</Link>
          </Button>
        ) : null}
        <Button asChild size="lg" variant="outline" className="h-12 flex-1 font-bold">
          <Link href={creatorHref}>View Creator</Link>
        </Button>
      </div>
    </motion.section>
  );
}
