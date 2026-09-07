"use client";

import { motion, useReducedMotion } from "motion/react";
import type { RuleRankingExample, RuleSection } from "@/types/rules";
import { formatPoints } from "@/lib/formatters";

interface RulesSectionBodyProps {
  section: RuleSection;
  rankingExample: RuleRankingExample[];
}

export function RulesSectionBody({ section, rankingExample }: RulesSectionBodyProps) {
  const reduceMotion = useReducedMotion();

  const item = (delay: number) =>
    reduceMotion
      ? undefined
      : {
          initial: { opacity: 0, y: -6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.2, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <div className="space-y-4">
      {section.paragraphs.map((paragraph, index) => (
        <motion.p
          key={paragraph}
          {...item(index * 0.04)}
          className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
        >
          {paragraph}
        </motion.p>
      ))}

      {section.bullets ? (
        <motion.ul
          {...item(0.08)}
          className="space-y-2 border-l border-border/60 pl-4 text-sm text-muted-foreground"
        >
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </motion.ul>
      ) : null}

      {section.showRankingExample ? (
        <motion.div {...item(0.12)} className="rounded-2xl border border-border/50 bg-card/60 p-4">
          {section.note ? (
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.note}
            </p>
          ) : null}
          <ol className="space-y-3">
            {rankingExample.map((entry) => (
              <li key={entry.username} className="flex items-center justify-between gap-4 text-sm">
                <span className="font-semibold">
                  #{entry.rank}{" "}
                  <span className="text-muted-foreground">@{entry.username}</span>
                </span>
                <span className="font-mono font-bold text-primary">
                  {formatPoints(entry.supportPoints)} Support
                </span>
              </li>
            ))}
          </ol>
        </motion.div>
      ) : null}
    </div>
  );
}
