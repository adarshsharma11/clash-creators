"use client";

import { notFound } from "next/navigation";
import { SupportExperience } from "@/components/support/support-experience";
import { SupportPageSkeleton } from "@/components/loading/support-page-skeleton";
import { ApiRetryButton, ApiStatusPanel } from "@/components/ui/api-status-panel";
import { useClash, useClashLeaderboard } from "@/hooks/queries/use-clashes";
import { useCreator } from "@/hooks/queries/use-creators";
import { leaderboardToEntries, toBattleFromDetail, toCreatorFromDetail } from "@/lib/clash-view";
import { ApiError, getApiErrorMessage } from "@/types/api";

interface SupportRouteProps {
  username: string;
}

export function SupportRoute({ username }: SupportRouteProps) {
  const creatorQuery = useCreator(username);
  const clashId = creatorQuery.data?.currentClash?.slug ?? creatorQuery.data?.currentClash?.id ?? "";
  const clashQuery = useClash(clashId, Boolean(clashId));
  const leaderboardQuery = useClashLeaderboard(clashId, { limit: 50 }, Boolean(clashId));

  if (creatorQuery.isPending || (clashId && (clashQuery.isPending || leaderboardQuery.isPending) && !clashQuery.data)) {
    return <SupportPageSkeleton />;
  }

  if (creatorQuery.isError) {
    if (creatorQuery.error instanceof ApiError && creatorQuery.error.status === 404) {
      notFound();
    }

    return (
      <main className="container mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-8">
        <ApiStatusPanel
          title="Unable to load this creator"
          message={getApiErrorMessage(creatorQuery.error)}
          action={<ApiRetryButton onRetry={() => void creatorQuery.refetch()} isRetrying={creatorQuery.isFetching} />}
        />
      </main>
    );
  }

  if (clashId && clashQuery.isError) {
    if (clashQuery.error instanceof ApiError && clashQuery.error.status === 404) {
      notFound();
    }

    return (
      <main className="container mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-8">
        <ApiStatusPanel
          title="Unable to load this clash"
          message={getApiErrorMessage(clashQuery.error)}
          action={<ApiRetryButton onRetry={() => void clashQuery.refetch()} isRetrying={clashQuery.isFetching} />}
        />
      </main>
    );
  }

  if (clashId && leaderboardQuery.isError) {
    return (
      <main className="container mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-8">
        <ApiStatusPanel
          title="Unable to load clash ranking"
          message={getApiErrorMessage(leaderboardQuery.error)}
          action={
            <ApiRetryButton
              onRetry={() => void leaderboardQuery.refetch()}
              isRetrying={leaderboardQuery.isFetching}
            />
          }
        />
      </main>
    );
  }

  const creator = toCreatorFromDetail(creatorQuery.data);
  const entries = leaderboardToEntries(leaderboardQuery.data?.items ?? []);
  const battle = clashQuery.data ? toBattleFromDetail(clashQuery.data, entries) : null;
  const entry = battle?.entries.find((item) => item.creator.id === creator.id) ?? null;

  return (
    <main className="flex flex-1 flex-col">
      <SupportExperience creator={creator} battle={battle} entry={entry} />
    </main>
  );
}
