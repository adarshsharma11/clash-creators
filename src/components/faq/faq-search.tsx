"use client";

import { Search } from "lucide-react";

interface FAQSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount?: number;
  totalCount?: number;
}

export function FAQSearch({ value, onChange, resultCount, totalCount }: FAQSearchProps) {
  return (
    <div className="relative">
      <label htmlFor="faq-search" className="sr-only">
        Search questions
      </label>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        id="faq-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search questions, answers, or topics"
        autoComplete="off"
        className="h-12 w-full rounded-2xl border border-border/50 bg-card/40 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
      />
      {value.trim() && typeof resultCount === "number" ? (
        <p className="mt-2 text-xs text-muted-foreground">
          {resultCount} {resultCount === 1 ? "result" : "results"}
          {typeof totalCount === "number" ? ` of ${totalCount}` : ""}
        </p>
      ) : null}
    </div>
  );
}
