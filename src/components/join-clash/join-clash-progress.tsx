"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import type { JoinClashStep } from "@/types/join-clash";

const STEPS: { id: JoinClashStep; label: string }[] = [
  { id: 1, label: "Creator" },
  { id: 2, label: "Category" },
  { id: 3, label: "Preview" },
  { id: 4, label: "Review" },
];

interface JoinClashProgressProps {
  step: JoinClashStep;
}

export function JoinClashProgress({ step }: JoinClashProgressProps) {
  const reduceMotion = useReducedMotion();

  return (
    <ol className="mb-8 flex items-center gap-1 sm:gap-2" aria-label="Join Clash progress">
      {STEPS.map((item, index) => {
        const complete = item.id < step;
        const current = item.id === step;

        return (
          <li key={item.id} className="flex min-w-0 flex-1 items-center last:flex-none">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                  current
                    ? "border-primary bg-primary text-primary-foreground"
                    : complete
                      ? "border-primary/40 bg-primary/15 text-primary"
                      : "border-border/60 text-muted-foreground"
                )}
                aria-current={current ? "step" : undefined}
              >
                {current && !reduceMotion ? (
                  <motion.span
                    layoutId="join-clash-step"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: "spring", bounce: 0.12, duration: 0.4 }}
                  />
                ) : null}
                <span className="relative z-10">{String(item.id).padStart(2, "0")}</span>
              </span>
              <span
                className={cn(
                  "hidden truncate text-xs font-semibold sm:inline",
                  current ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </div>
            {index < STEPS.length - 1 ? (
              <div
                className={cn(
                  "mx-2 h-px min-w-4 flex-1",
                  complete ? "bg-primary/50" : "bg-border/60"
                )}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
