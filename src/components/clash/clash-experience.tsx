"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { BattleHero } from "@/components/clash/battle-hero";
import { Leaderboard } from "@/components/home/leaderboard";
import { ClashPageSkeleton } from "@/components/loading/clash-page-skeleton";
import { Avatar } from "@/components/ui/avatar";
import { ApiRetryButton, ApiStatusPanel } from "@/components/ui/api-status-panel";
import { usePrefetchCreator } from "@/hooks/queries/use-creators";
import { useClash, useClashLeaderboard, useLiveClash } from "@/hooks/queries/use-clashes";
import { CURRENT_BATTLE_ID } from "@/data/constants";
import { leaderboardToEntries, toBattleFromDetail } from "@/lib/clash-view";
import { ApiError, getApiErrorMessage } from "@/types/api";

interface ClashExperienceProps {
  clashId: string;
}

export function ClashExperience({ clashId }: ClashExperienceProps) {
  const isLiveAlias = clashId === CURRENT_BATTLE_ID;
  const liveQuery = useLiveClash();
  const resolvedId = isLiveAlias ? (liveQuery.data?.slug ?? liveQuery.data?.id ?? "") : clashId;
  const waitingForLive = isLiveAlias && liveQuery.isPending;
  const clashQuery = useClash(resolvedId, !waitingForLive && resolvedId.length > 0);
  const leaderboardQuery = useClashLeaderboard(resolvedId, { limit: 50 }, Boolean(resolvedId));
  const prefetchCreator = usePrefetchCreator();

  if (waitingForLive || clashQuery.isPending || (resolvedId && leaderboardQuery.isPending && !leaderboardQuery.data)) {
    return <ClashPageSkeleton />;
  }

  if (isLiveAlias && liveQuery.isError) {
    return (
      <main className="container mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-8">
        <ApiStatusPanel
          title="Unable to load today's clash"
          message={getApiErrorMessage(liveQuery.error)}
          action={<ApiRetryButton onRetry={() => void liveQuery.refetch()} isRetrying={liveQuery.isFetching} />}
        />
      </main>
    );
  }

  if (isLiveAlias && !liveQuery.data) {
    return (
      <main className="container mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-8">
        <ApiStatusPanel
          title="No live clash right now"
          message="A new clash will appear here when it goes live."
        />
      </main>
    );
  }

  if (clashQuery.isError) {
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

  if (leaderboardQuery.isError) {
    return (
      <main className="container mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-8">
        <ApiStatusPanel
          title="Unable to load the leaderboard"
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

  const clash = clashQuery.data;
  if (!clash) {
    notFound();
  }

  const entries = leaderboardToEntries(leaderboardQuery.data?.items ?? []);
  const battle = toBattleFromDetail(clash, entries);
  const moreCreators = entries.slice(10, 14).map((entry) => entry.creator);

  return (
    <main className="flex flex-1 flex-col">
      <div className="container mx-auto px-4 py-4 sm:px-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Home
        </Link>
      </div>

      <BattleHero battle={battle} />

      <div className="container mx-auto max-w-5xl px-4 sm:px-8">
        {entries.length === 0 ? (
          <div className="py-16">
            <ApiStatusPanel
              title="No creators on the board yet"
              message="Creators will appear here when they join this clash."
            />
          </div>
        ) : (
          <Leaderboard initialEntries={entries} />
        )}

        {moreCreators.length > 0 ? (
          <section className="border-t border-border/40 py-16">
            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">Also competing</h2>
              <p className="text-muted-foreground">Creators further down the board still in this clash.</p>
            </div>

            <ul className="divide-y divide-border/40">
              {moreCreators.map((creator) => (
                <li key={creator.id}>
                  <Link
                    href={`/creators/${creator.username}`}
                    onMouseEnter={() => prefetchCreator(creator.username)}
                    onFocus={() => prefetchCreator(creator.username)}
                    className="group flex items-center gap-4 py-4 transition-colors hover:text-primary"
                  >
                    <Avatar
                      src={creator.avatarUrl ?? undefined}
                      alt={creator.displayName}
                      fallback={creator.displayName}
                      className="h-12 w-12"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{creator.displayName}</div>
                      <div className="truncate text-sm text-muted-foreground">
                        @{creator.username}
                        {creator.category ? ` · ${creator.category}` : ""}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
