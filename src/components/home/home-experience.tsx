"use client";

import { BattleHeader } from "@/components/home/battle-header";
import { CategoryList } from "@/components/home/category-list";
import { FinalCTA } from "@/components/home/final-cta";
import { HeroSection } from "@/components/home/hero-section";
import { HowItWorks } from "@/components/home/how-it-works";
import { Leaderboard } from "@/components/home/leaderboard";
import { WinnersPreview } from "@/components/home/winners-preview";
import { ApiRetryButton, ApiStatusPanel } from "@/components/ui/api-status-panel";
import { SkeletonLeaderboardRow } from "@/components/ui/skeleton";
import { CURRENT_BATTLE_ID } from "@/data/constants";
import { useCategories } from "@/hooks/queries/use-categories";
import { useClashLeaderboard, useLiveClash } from "@/hooks/queries/use-clashes";
import { useRecentWinners } from "@/hooks/queries/use-winners";
import { leaderboardToEntries, toBattleView } from "@/lib/clash-view";
import { getApiErrorMessage } from "@/types/api";

export function HomeExperience() {
  const liveQuery = useLiveClash();
  const liveClash = liveQuery.data ?? null;
  const liveId = liveClash?.slug ?? liveClash?.id ?? "";
  const leaderboardQuery = useClashLeaderboard(liveId, { limit: 50 }, Boolean(liveId));
  const categoriesQuery = useCategories();
  const winnersQuery = useRecentWinners();

  const entries = leaderboardToEntries(leaderboardQuery.data?.items ?? []);
  const battle = liveClash ? toBattleView(liveClash, entries) : null;
  const clashHref = liveClash ? `/clash/${liveClash.slug}` : `/clash/${CURRENT_BATTLE_ID}`;

  return (
    <main className="flex flex-1 flex-col">
      <HeroSection />

      <div className="container mx-auto max-w-5xl px-4 sm:px-8">
        <section className="border-t border-border/40 py-12 md:py-20" id="creators">
          {liveQuery.isPending || (liveId && leaderboardQuery.isPending && !leaderboardQuery.data) ? (
            <div aria-busy="true" aria-label="Loading leaderboard" className="space-y-3">
              <SkeletonLeaderboardRow />
              <SkeletonLeaderboardRow />
              <SkeletonLeaderboardRow />
            </div>
          ) : liveQuery.isError || (liveId && leaderboardQuery.isError) ? (
            <ApiStatusPanel
              title="Unable to load the leaderboard"
              message={getApiErrorMessage(liveQuery.error ?? leaderboardQuery.error)}
              action={
                <ApiRetryButton
                  onRetry={() => {
                    if (liveQuery.isError) void liveQuery.refetch();
                    if (leaderboardQuery.isError) void leaderboardQuery.refetch();
                  }}
                  isRetrying={liveQuery.isFetching || leaderboardQuery.isFetching}
                />
              }
            />
          ) : battle ? (
            <>
              <BattleHeader battle={battle} />
              {entries.length === 0 ? (
                <ApiStatusPanel
                  title="No creators on the board yet"
                  message="Creators will appear here when they join today's clash."
                />
              ) : (
                <Leaderboard initialEntries={entries} />
              )}
            </>
          ) : (
            <ApiStatusPanel
              title="No live clash right now"
              message="A new clash will appear here when it goes live."
            />
          )}
        </section>

        {categoriesQuery.isError ? (
          <div className="py-12">
            <ApiStatusPanel
              title="Unable to load categories"
              message={getApiErrorMessage(categoriesQuery.error)}
              action={
                <ApiRetryButton
                  onRetry={() => void categoriesQuery.refetch()}
                  isRetrying={categoriesQuery.isFetching}
                />
              }
            />
          </div>
        ) : categoriesQuery.data ? (
          <CategoryList categories={categoriesQuery.data} />
        ) : null}

        <HowItWorks />

        {winnersQuery.isError ? (
          <div className="py-12">
            <ApiStatusPanel
              title="Unable to load recent champions"
              message={getApiErrorMessage(winnersQuery.error)}
              action={
                <ApiRetryButton
                  onRetry={() => void winnersQuery.refetch()}
                  isRetrying={winnersQuery.isFetching}
                />
              }
            />
          </div>
        ) : winnersQuery.isPending ? null : (
          <WinnersPreview winners={winnersQuery.data ?? []} ctaHref="/winners" ctaLabel="View Hall of Fame →" />
        )}

        <FinalCTA clashHref={clashHref} />
      </div>
    </main>
  );
}
