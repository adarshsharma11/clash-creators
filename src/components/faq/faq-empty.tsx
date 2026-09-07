"use client";

import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

interface FAQEmptyProps {
  onClear: () => void;
}

export function FAQEmpty({ onClear }: FAQEmptyProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border border-dashed border-border/60 px-6 py-16 text-center"
    >
      <h2 className="mb-2 text-xl font-bold tracking-tight">No results found</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Try a different search term or browse all questions.
      </p>
      <Button variant="outline" onClick={onClear}>
        Clear Search
      </Button>
    </motion.div>
  );
}
