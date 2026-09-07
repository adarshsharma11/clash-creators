"use client";

import type { ReactNode } from "react";
import { CategoryGrid } from "@/components/categories/category-grid";
import { FeaturedCategories } from "@/components/categories/featured-categories";
import { CategoryPageSkeleton } from "@/components/loading/category-page-skeleton";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/queries/use-categories";
import { getApiErrorMessage } from "@/types/api";

export function CategoriesExperience() {
  const { data: categories, isPending, isError, error, refetch, isFetching } = useCategories();

  if (isPending) {
    return <CategoryPageSkeleton variant="index" />;
  }

  if (isError) {
    return (
      <CategoriesStatus
        title="Unable to load categories"
        message={getApiErrorMessage(error)}
        action={
          <Button onClick={() => void refetch()} disabled={isFetching} className="font-bold">
            {isFetching ? "Retrying…" : "Try again"}
          </Button>
        }
      />
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <CategoriesStatus
        title="No categories yet"
        message="Categories will appear here when they become available."
      />
    );
  }

  return (
    <div className="pb-16">
      <header className="mb-10 max-w-2xl">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Categories
        </h1>
        <p className="text-lg text-muted-foreground">
          Every category has its own ranking. Pick one to see who leads it.
        </p>
      </header>

      <div className="space-y-12">
        <FeaturedCategories categories={categories.slice(0, 3)} />
        <CategoryGrid categories={categories} />
      </div>
    </div>
  );
}

function CategoriesStatus({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="pb-16">
      <header className="mb-10 max-w-2xl">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          Categories
        </h1>
        <p className="text-lg text-muted-foreground">
          Every category has its own ranking. Pick one to see who leads it.
        </p>
      </header>
      <div className="rounded-2xl border border-dashed border-border/60 px-6 py-16 text-center">
        <h2 className="mb-2 text-xl font-bold tracking-tight">{title}</h2>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        {action}
      </div>
    </div>
  );
}
