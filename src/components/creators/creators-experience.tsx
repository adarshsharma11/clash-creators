"use client";

import { CreatorCard } from "@/components/creators/creator-card";
import { ApiRetryButton, ApiStatusPanel } from "@/components/ui/api-status-panel";
import { PageLoader } from "@/components/ui/page-loader";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useCreators } from "@/hooks/queries/use-creators";
import { getApiErrorMessage } from "@/types/api";

function CreatorsDirectorySkeleton() {
  return (
    <PageLoader label="Loading creators">
      <header className="mb-10 max-w-2xl">
        <div className="mb-3 h-12 w-64 rounded-lg bg-muted" />
        <div className="h-5 w-full max-w-md rounded bg-muted" />
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SkeletonCard className="h-48" />
        <SkeletonCard className="h-48" />
        <SkeletonCard className="h-48" />
        <SkeletonCard className="h-48" />
        <SkeletonCard className="h-48" />
        <SkeletonCard className="h-48" />
      </div>
    </PageLoader>
  );
}

export function CreatorsExperience() {
  const { data, isPending, isError, error, refetch, isFetching } = useCreators({
    page: 1,
    limit: 50,
  });

  if (isPending) {
    return <CreatorsDirectorySkeleton />;
  }

  if (isError) {
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

  if (creators.length === 0) {
    return (
      <div className="pb-16">
        <CreatorsHeader />
        <ApiStatusPanel
          title="No creators yet"
          message="Creators will appear here when they join ClashCreators."
        />
      </div>
    );
  }

  return (
    <div className="pb-16">
      <CreatorsHeader />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {creators.map((creator, index) => (
          <CreatorCard key={creator.id} creator={creator} index={index} />
        ))}
      </div>
    </div>
  );
}

function CreatorsHeader() {
  return (
    <header className="mb-10 max-w-2xl">
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Creators</h1>
      <p className="text-lg text-muted-foreground">
        Support the creators competing in live clashes and climbing the ranks.
      </p>
    </header>
  );
}
