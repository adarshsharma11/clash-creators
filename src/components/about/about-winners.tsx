"use client";

import { WinnersPreview } from "@/components/home/winners-preview";
import { ApiRetryButton, ApiStatusPanel } from "@/components/ui/api-status-panel";
import { useRecentWinners } from "@/hooks/queries/use-winners";
import { getApiErrorMessage } from "@/types/api";

export function AboutWinners() {
  const { data, isPending, isError, error, refetch, isFetching } = useRecentWinners();

  if (isPending) {
    return null;
  }

  if (isError) {
    return (
      <div className="container mx-auto max-w-6xl px-4 sm:px-8">
        <ApiStatusPanel
          title="Unable to load recent champions"
          message={getApiErrorMessage(error)}
          action={<ApiRetryButton onRetry={() => void refetch()} isRetrying={isFetching} />}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-8">
      <WinnersPreview
        winners={data ?? []}
        title="Some creators leave their mark."
        description="Past Clash winners remain part of the ClashCreators story."
        ctaHref="/winners"
        ctaLabel="View Hall of Fame →"
      />
    </div>
  );
}
