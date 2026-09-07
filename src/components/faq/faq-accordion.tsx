"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { FAQItem as FAQItemType } from "@/types/faq";
import { FAQItem } from "./faq-item";

interface FAQAccordionProps {
  items: FAQItemType[];
  openIds: string[];
  onToggle: (id: string) => void;
}

export function FAQAccordion({ items, openIds, onToggle }: FAQAccordionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/30">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{
              duration: 0.2,
              delay: reduceMotion ? 0 : Math.min(index * 0.03, 0.15),
            }}
          >
            <FAQItem
              item={item}
              open={openIds.includes(item.id)}
              onToggle={() => onToggle(item.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
