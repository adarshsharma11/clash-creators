"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { FAQItem as FAQItemType } from "@/types/faq";
import { AccordionItem } from "@/components/ui/accordion-item";

interface FAQItemProps {
  item: FAQItemType;
  open: boolean;
  onToggle: () => void;
}

export function FAQItem({ item, open, onToggle }: FAQItemProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AccordionItem
      id={item.id}
      title={item.question}
      variant="faq"
      open={open}
      onToggle={onToggle}
    >
      <div className="space-y-3">
        {item.answer.map((paragraph) => (
          <motion.p
            key={paragraph}
            initial={reduceMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-sm leading-relaxed text-muted-foreground"
          >
            {paragraph}
          </motion.p>
        ))}

        {item.link ? (
          <Link
            href={item.link.href}
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            {item.link.label}
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </div>
    </AccordionItem>
  );
}
