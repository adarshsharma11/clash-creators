"use client";

import type { RuleSection } from "@/types/rules";
import { cn } from "@/lib/utils";

interface RulesTocProps {
  sections: RuleSection[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function RulesToc({ sections, activeId, onSelect }: RulesTocProps) {
  return (
    <nav aria-label="Rules sections">
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        On this page
      </p>
      <ul className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <li key={section.id} className="shrink-0">
              <a
                href={`#${section.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  onSelect(section.id);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "font-mono text-xs font-bold",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {section.number}
                </span>
                <span className="whitespace-nowrap font-medium">{section.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
