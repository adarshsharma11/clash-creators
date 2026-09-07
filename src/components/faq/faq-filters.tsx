"use client";

import { faqFilters } from "@/data/faq";
import type { FAQFilterId } from "@/types/faq";
import { cn } from "@/lib/utils";

interface FAQFiltersProps {
  value: FAQFilterId;
  onChange: (value: FAQFilterId) => void;
}

export function FAQFilters({ value, onChange }: FAQFiltersProps) {
  return (
    <div
      role="group"
      aria-label="Filter questions by topic"
      className="flex gap-2 overflow-x-auto pb-1"
    >
      {faqFilters.map((filter) => {
        const selected = value === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(filter.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selected
                ? "border-primary/30 bg-primary/10 text-foreground"
                : "border-border/50 text-muted-foreground hover:border-primary/20 hover:text-foreground"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
