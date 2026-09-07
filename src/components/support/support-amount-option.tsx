"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface SupportAmountOptionProps {
  amount: number;
  selected: boolean;
  onSelect: (amount: number) => void;
  index: number;
}

export function SupportAmountOption({
  amount,
  selected,
  onSelect,
  index,
}: SupportAmountOptionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
    >
      <motion.button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={() => onSelect(amount)}
        layout
        className={cn(
          "flex h-24 w-full flex-col items-center justify-center rounded-2xl border text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          selected
            ? "border-primary bg-primary/10 text-foreground"
            : "border-border/50 bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        )}
      >
        <span className="text-2xl font-black tracking-tight">+{amount}</span>
        <span className="text-xs font-semibold uppercase tracking-wider">Points</span>
      </motion.button>
    </motion.div>
  );
}
