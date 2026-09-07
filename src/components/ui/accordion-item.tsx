"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionVariant = "rules" | "faq";

export type AccordionItemProps = {
  id: string;
  title: string;
  number?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  variant?: AccordionVariant;
  highlighted?: boolean;
};

const accordionEase = [0.22, 1, 0.36, 1] as const;

export function AccordionItem({
  id,
  title,
  number,
  open,
  onToggle,
  children,
  variant = "faq",
  highlighted = false,
}: AccordionItemProps) {
  const reduceMotion = useReducedMotion();
  const triggerId = `${id}-trigger`;
  const panelId = `${id}-panel`;
  const isRules = variant === "rules";

  return (
    <div
      id={id}
      className={cn(
        "scroll-mt-28 border-b border-border/50 last:border-b-0",
        open && "bg-primary/[0.04]",
        highlighted && "ring-1 ring-primary/40"
      )}
    >
      <h3 className="m-0">
        <button
          id={triggerId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn(
            "group flex w-full items-center gap-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            isRules ? "px-4 py-4 sm:px-5 sm:py-5" : "px-4 py-3.5 sm:px-5",
            open ? "text-foreground" : "text-foreground/90 hover:bg-secondary/40"
          )}
        >
          {number ? (
            <span
              className={cn(
                "w-8 shrink-0 font-mono text-sm font-bold tabular-nums transition-colors",
                open ? "text-primary" : "text-muted-foreground"
              )}
            >
              {number}
            </span>
          ) : null}

          <span
            className={cn(
              "min-w-0 flex-1 font-semibold tracking-tight",
              isRules ? "text-base sm:text-lg" : "text-sm sm:text-base"
            )}
          >
            {title}
          </span>

          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 180 : 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.22, ease: accordionEase }
            }
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
              open
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border/60 text-muted-foreground group-hover:border-primary/30 group-hover:text-foreground"
            )}
          >
            <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-px" />
          </motion.span>
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0.01 }
                : { duration: 0.24, ease: accordionEase }
            }
            className="overflow-hidden"
          >
            <div
              className={cn(
                "pb-5",
                isRules ? "px-4 sm:px-5 sm:pl-[3.25rem]" : "px-4 sm:px-5"
              )}
            >
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
