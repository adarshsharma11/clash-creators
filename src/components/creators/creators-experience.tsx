"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { CreatorCard } from "@/components/creators/creator-card";
import { ApiRetryButton, ApiStatusPanel } from "@/components/ui/api-status-panel";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/page-loader";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/queries/use-categories";
import { useCreators } from "@/hooks/queries/use-creators";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getApiErrorMessage } from "@/types/api";

function CreatorsDirectorySkeleton() {
  return (
    <PageLoader label="Loading creators">
      <header className="mb-10 max-w-2xl">
        <div className="mb-3 h-12 w-64 rounded-lg bg-muted" />
        <div className="h-5 w-full max-w-md rounded bg-muted" />
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard className="h-56" />
        <SkeletonCard className="h-56" />
        <SkeletonCard className="h-56" />
        <SkeletonCard className="h-56" />
        <SkeletonCard className="h-56" />
        <SkeletonCard className="h-56" />
      </div>
    </PageLoader>
  );
}

export function CreatorsExperience() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const debouncedSearch = useDebouncedValue(search, 300);
  const categoriesQuery = useCategories();
  const { data, isPending, isError, error, refetch, isFetching } = useCreators({
    page: 1,
    limit: 50,
    search: debouncedSearch.trim() || undefined,
    category: category || undefined,
  });

  if (isPending && !data) {
    return <CreatorsDirectorySkeleton />;
  }

  if (isError && !data) {
    return (
      <div className="pb-16">
        <CreatorsHeader />
        <ApiStatusPanel
          title="Unable to load creators"
          message={getApiErrorMessage(error)}
          action={<ApiRetryButton onRetry={() => void refetch()} isRetrying={isFetching} />}
        />
      </div>
    );
  }

  const creators = data?.items ?? [];
  const hasFilters = Boolean(search.trim() || category);

  return (
    <div className="pb-16">
      <CreatorsHeader />
      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="creator-search" className="sr-only">
            Search creators
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <input
            id="creator-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or username"
            className="h-11 w-full rounded-xl border border-border/50 bg-card/40 pl-10 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <label htmlFor="creator-category" className="sr-only">
          Filter by category
        </label>
        <select
          id="creator-category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-11 rounded-xl border border-border/50 bg-card/40 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All categories</option>
          {(categoriesQuery.data ?? []).map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {creators.length === 0 ? (
        <EmptyState
          title={hasFilters ? "No creators found" : "No creators yet"}
          message={
            hasFilters
              ? "Try another search or clear filters to see more creators."
              : "Creators will appear here when they join ClashCreators."
          }
          action={
            hasFilters ? (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setCategory("");
                }}
              >
                Clear filters
              </Button>
            ) : (
              <Button asChild>
                <Link href="/join-clash">Join Clash</Link>
              </Button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator, index) => (
            <CreatorCard key={creator.id} creator={creator} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}

function CreatorsHeader() {
  return (
    <header className="mb-8 max-w-2xl">
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Creators</h1>
      <p className="text-lg text-muted-foreground">
        Find a creator, open their clash, and support them.
      </p>
    </header>
  );
}
