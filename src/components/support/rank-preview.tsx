"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Creator } from "@/types/creator";
import type { SupportRankPreview } from "@/types/support";
import { formatPoints } from "@/lib/formatters";

interface RankPreviewProps {
  creator: Creator;
  preview: SupportRankPreview | null;
  amount: number | null;
}

export function RankPreview({ creator, preview, amount }: RankPreviewProps) {
  const reduceMotion = useReducedMotion();

  if (!amount || !preview) {
    return null;
  }

  const firstName = creator.displayName.split(" ")[0]?.toUpperCase() ?? creator.displayName.toUpperCase();

  let message = `🔥 ${formatPoints(preview.afterDistanceToFirst)} more points to reach #1`;

  if (preview.becomesFirst) {
    message = `🔥 THIS SUPPORT COULD MOVE ${firstName} TO #1`;
  } else if (preview.remainsFirst) {
    message = `👑 This support extends ${creator.displayName}'s lead`;
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.22 }}
          className="text-sm font-bold uppercase tracking-wide text-orange-400"
        >
          {message}
        </motion.p>
      </AnimatePresence>

      {preview.rankImproved ? (
        <motion.p
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-semibold text-emerald-400"
        >
          ↑ Possible new position: #{preview.afterRank}
        </motion.p>
      ) : null}
    </div>
  );
}
