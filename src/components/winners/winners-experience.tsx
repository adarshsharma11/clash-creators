"use client";

import { useMemo, useState } from "react";
import { WinnersPreview } from "@/components/home/winners-preview";
import { SimplePageSkeleton } from "@/components/loading/simple-page-skeleton";
import { ApiRetryButton, ApiStatusPanel } from "@/components/ui/api-status-panel";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/queries/use-categories";
import { useWinners } from "@/hooks/queries/use-winners";
import { toHallOfFameWinner } from "@/lib/api/winners";
import { getApiErrorMessage } from "@/types/api";
import type { HallOfFameWinner } from "@/types/winner";

export function WinnersExperience() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const categoriesQuery = useCategories();
  const winnersQuery = useWinners({
    page,
    limit: 12,
    category: category || undefined,
  });

  const winners = useMemo(
    () =>
      (winnersQuery.data?.items ?? [])
        .map(toHallOfFameWinner)
        .filter((winner): winner is HallOfFameWinner => winner !== null),
    [winnersQuery.data?.items]
  );
  const pagination = winnersQuery.data?.pagination;

  if (winnersQuery.isPending && !winnersQuery.data) {
    return <SimplePageSkeleton />;
  }

  if (winnersQuery.isError) {
    return (
      <main className="container mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-8">
        <ApiStatusPanel
          title="Unable to load winners"
          message={getApiErrorMessage(winnersQuery.error)}
          action={<ApiRetryButton onRetry={() => void winnersQuery.refetch()} isRetrying={winnersQuery.isFetching} />}
        />
      </main>
    );
  }

  return (
    <main className="container mx-auto max-w-5xl flex-1 px-4 pb-16 pt-10 sm:px-8">
      <header className="mb-8 max-w-2xl">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Hall of Fame</h1>
        <p className="text-lg text-muted-foreground">
          Daily champions, winning points, and the clashes they won.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-3">
        <Button size="sm" variant={category === "" ? "default" : "outline"} onClick={() => { setCategory(""); setPage(1); }}>
          All categories
        </Button>
        {(categoriesQuery.data ?? []).map((item) => (
          <Button
            key={item.id}
            size="sm"
            variant={category === item.slug ? "default" : "outline"}
            onClick={() => {
              setCategory(item.slug);
              setPage(1);
            }}
          >
            {item.name}
          </Button>
        ))}
      </div>

      {winners.length === 0 ? (
        <ApiStatusPanel title="No winners yet" message="Completed clashes with a champion will appear here." />
      ) : (
        <WinnersPreview winners={winners} title="Recent champions" />
      )}

      {pagination && pagination.totalPages > 1 ? (
        <div className="mt-8 flex justify-end gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </main>
  );
}
