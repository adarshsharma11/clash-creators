"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/categories/category-icon";
import type { Category } from "@/types/category";
import type { JoinClashDraft, JoinClashFieldErrors } from "@/types/join-clash";

interface CategoryStepProps {
  draft: JoinClashDraft;
  errors: JoinClashFieldErrors;
  categories: Category[];
  onSelect: (categoryId: string) => void;
}

export function CategoryStep({ draft, errors, categories, onSelect }: CategoryStepProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Choose your Clash</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick the category you want to compete in.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Clash category"
        aria-invalid={Boolean(errors.categoryId)}
        aria-describedby={errors.categoryId ? "category-error" : undefined}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {categories.map((category) => {
          const selected = draft.categoryId === category.id;

          return (
            <button
              key={category.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(category.id)}
              className={cn(
                "relative flex min-h-24 flex-col items-start gap-3 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border/50 bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {selected && !reduceMotion ? (
                <motion.span
                  layoutId="join-clash-category"
                  className="absolute inset-0 rounded-2xl border border-primary bg-primary/10"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
                />
              ) : null}
              <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/70 text-primary">
                <CategoryIcon name={category.icon} slug={category.slug} label={category.name} className="h-4 w-4" />
              </span>
              <span className="relative z-10 text-sm font-bold">{category.name}</span>
            </button>
          );
        })}
      </div>

      {errors.categoryId ? (
        <p id="category-error" role="alert" className="text-sm text-red-400">
          {errors.categoryId}
        </p>
      ) : null}
    </div>
  );
}
