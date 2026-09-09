"use client";

import Link from "next/link";
import { AchievementsGrid } from "@/components/creators/achievements-grid";
import { BattleHistoryList } from "@/components/creators/battle-history-list";
import { CreatorHero } from "@/components/creators/creator-hero";
import { CreatorStats } from "@/components/creators/creator-stats";
import { CurrentClashCard } from "@/components/creators/current-clash-card";
import { SupportersPreview } from "@/components/creators/supporters-preview";
import { CreatorProfileEditor } from "@/components/creators/creator-profile-editor";
import { CreatorSocialEditor } from "@/components/creators/creator-social-editor";
import { ReportCreatorForm } from "@/components/creators/report-creator-form";
import { useAuth } from "@/context/auth-context";
import { CreatorPageSkeleton } from "@/components/loading/creator-page-skeleton";
import { ApiRetryButton, ApiStatusPanel } from "@/components/ui/api-status-panel";
import { Button } from "@/components/ui/button";
import { useClashLeaderboard } from "@/hooks/queries/use-clashes";
import { useCreator, useCreatorClashes, useCreatorSupporters } from "@/hooks/queries/use-creators";
import { resolveCreatorUsername, toCreatorFromDetail } from "@/lib/clash-view";
import { formatShortDate } from "@/lib/formatters";
import { ApiError, getApiErrorMessage } from "@/types/api";
import type { Achievement } from "@/types/achievements";
import type { BattleHistory } from "@/types/battle-history";
import type { Supporter } from "@/types/supporter";

interface CreatorProfileExperienceProps {
  username: string;
}

export function CreatorProfileExperience({ username }: CreatorProfileExperienceProps) {
  const { user, creatorProfile, isAuthenticated } = useAuth();
  const creatorQuery = useCreator(username);
  const clashesQuery = useCreatorClashes(username, { page: 1, limit: 20 }, creatorQuery.isSuccess);
  const supportersQuery = useCreatorSupporters(username, creatorQuery.isSuccess);
  const currentClashId = creatorQuery.data?.currentClash?.slug ?? creatorQuery.data?.currentClash?.id ?? "";
  const leaderboardQuery = useClashLeaderboard(currentClashId, { limit: 50 }, Boolean(currentClashId));

  if (creatorQuery.isPending) {
    return <CreatorPageSkeleton />;
  }

  if (creatorQuery.isError) {
    if (creatorQuery.error instanceof ApiError && creatorQuery.error.status === 404) {
      return (
        <main className="container mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-8">
          <ApiStatusPanel
            title="Creator not found"
            message="This creator is unavailable or the username is incorrect."
            action={
              <Button asChild className="font-bold">
                <Link href="/creators">Browse creators</Link>
              </Button>
            }
          />
        </main>
      );
    }

    return (
      <main className="container mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-8">
        <ApiStatusPanel
          title="Unable to load this creator"
          message={getApiErrorMessage(creatorQuery.error)}
          action={
            <ApiRetryButton
              onRetry={() => void creatorQuery.refetch()}
              isRetrying={creatorQuery.isFetching}
            />
          }
        />
      </main>
    );
  }

  const creator = creatorQuery.data;
  if (!creator) {
    return (
      <main className="container mx-auto max-w-5xl flex-1 px-4 py-16 sm:px-8">
        <ApiStatusPanel title="Creator not found" message="This creator is unavailable or the username is incorrect." />
      </main>
    );
  }
  const profile = toCreatorFromDetail(creator);
  const history: BattleHistory[] = (clashesQuery.data?.items ?? []).map((item) => ({
    id: item.clash.id,
    date: formatShortDate(item.clash.endsAt),
    rank: item.finalRank,
    supportPoints: item.supportPoints,
    title: item.clash.title,
    status: item.clash.status,
  }));
  const achievements: Achievement[] = creator.achievements.map((item) => ({
    id: item.id,
    title: item.name,
    icon: item.icon ?? item.slug,
    slug: item.slug,
    description: item.description ?? "",
    isUnlocked: true,
  }));
  const supporters: Supporter[] = (supportersQuery.data?.items ?? []).map((item, index) => ({
    id: item.username ?? `supporter-${index}`,
    username: item.username ?? "supporter",
    displayName: item.fullName ?? item.username ?? "Supporter",
    avatarUrl: item.avatarUrl,
    supportAmount: item.points,
  }));

  const leaderboard = leaderboardQuery.data?.items ?? [];
  const currentEntry = leaderboard.find((item) => item.creator?.id === creator.id);
  const previousEntry =
    currentEntry && currentEntry.rank > 1
      ? leaderboard.find((item) => item.rank === currentEntry.rank - 1)
      : undefined;

  const secondaryError = clashesQuery.error ?? supportersQuery.error ?? leaderboardQuery.error;
  const canRetrySecondary = clashesQuery.isError || supportersQuery.isError || leaderboardQuery.isError;

  return (
    <main className="flex flex-1 flex-col pb-20 md:pb-0">
      <CreatorHero
        creator={profile}
        totalWins={creator.wins}
        socialAccounts={creator.socialAccounts}
        rank={currentEntry?.rank ?? null}
        supportPoints={currentEntry?.points ?? creator.supportTotals.points}
        clashTitle={creator.currentClash?.title}
      />

      <div className="container mx-auto max-w-5xl px-4 sm:px-8">
        {canRetrySecondary ? (
          <div className="pt-8">
            <ApiStatusPanel
              title="Some profile data could not be loaded"
              message={getApiErrorMessage(secondaryError)}
              action={
                <ApiRetryButton
                  onRetry={() => {
                    if (clashesQuery.isError) void clashesQuery.refetch();
                    if (supportersQuery.isError) void supportersQuery.refetch();
                    if (leaderboardQuery.isError) void leaderboardQuery.refetch();
                  }}
                  isRetrying={clashesQuery.isFetching || supportersQuery.isFetching || leaderboardQuery.isFetching}
                />
              }
            />
          </div>
        ) : null}

        <CreatorStats
          stats={{
            wins: creator.wins,
            supportPoints: creator.supportTotals.points,
            supportCount: creator.supportTotals.count,
            clashes: clashesQuery.data?.pagination.total ?? creator.recentClashes.length,
          }}
        />

        {creator.currentClash ? (
          <CurrentClashCard
            clash={{
              title: creator.currentClash.title,
              slug: creator.currentClash.slug,
              endsAt: creator.currentClash.endsAt,
              rank: currentEntry?.rank ?? null,
              supportPoints: currentEntry?.points ?? 0,
              pointsToPrevious:
                currentEntry && previousEntry
                  ? Math.max(0, previousEntry.points - currentEntry.points)
                  : null,
              previousRank: previousEntry?.rank ?? null,
              username: resolveCreatorUsername(creator),
            }}
          />
        ) : null}

        <BattleHistoryList history={history} />
        <AchievementsGrid achievements={achievements} />
        <SupportersPreview supporters={supporters} />
        {isAuthenticated && creatorProfile && user?.username === resolveCreatorUsername(creator) ? (
          <>
            <CreatorProfileEditor creator={creator} />
            <CreatorSocialEditor username={resolveCreatorUsername(creator)} accounts={creator.socialAccounts} />
          </>
        ) : null}
        {isAuthenticated && user?.username && user.username !== resolveCreatorUsername(creator) ? (
          <ReportCreatorForm creatorId={creator.id} username={resolveCreatorUsername(creator)} />
        ) : null}
      </div>
    </main>
  );
}
