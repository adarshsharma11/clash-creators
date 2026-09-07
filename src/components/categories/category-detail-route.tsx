"use client";

import { CategoryDetailExperience } from "@/components/categories/category-detail-experience";
import { CategoryPageSkeleton } from "@/components/loading/category-page-skeleton";
import { ApiRetryButton, ApiStatusPanel } from "@/components/ui/api-status-panel";
import { CURRENT_BATTLE_ID } from "@/data/constants";
import { useCategory } from "@/hooks/queries/use-categories";
import { useClashLeaderboard, useLiveClash } from "@/hooks/queries/use-clashes";
import { useCreators } from "@/hooks/queries/use-creators";
import { isPrimarySocialVerified, resolveCreatorUsername } from "@/lib/clash-view";
import type { CategoryListItem } from "@/lib/category-rankings";
import { ApiError, getApiErrorMessage } from "@/types/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CategoryDetailRoute({ slug }: { slug: string }) {
  const categoryQuery = useCategory(slug);
  const creatorsQuery = useCreators({ category: slug, page: 1, limit: 50 });
  const liveQuery = useLiveClash();
  const liveClash = liveQuery.data ?? null;
  const liveId = liveClash?.slug ?? liveClash?.id ?? "";
  const leaderboardQuery = useClashLeaderboard(liveId, { limit: 50 }, Boolean(liveId));

  if (categoryQuery.isPending && !categoryQuery.data) {
    return <CategoryPageSkeleton variant="detail" />;
  }

  if (categoryQuery.isError) {
    if (categoryQuery.error instanceof ApiError && categoryQuery.error.status === 404) {
      return (
        <div className="mx-auto max-w-5xl pb-16">
          <ApiStatusPanel
            title="Category not found"
            message="This category does not exist, or it is no longer available."
            action={
              <Button asChild className="font-bold">
                <Link href="/categories">Back to categories</Link>
              </Button>
            }
          />
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-5xl pb-16">
        <ApiStatusPanel
          title="Unable to load this category"
          message={getApiErrorMessage(categoryQuery.error)}
          action={
            <ApiRetryButton
              onRetry={() => void categoryQuery.refetch()}
              isRetrying={categoryQuery.isFetching}
            />
          }
        />
      </div>
    );
  }

  const category = categoryQuery.data;

  if (!category) {
    return (
      <div className="mx-auto max-w-5xl pb-16">
        <ApiStatusPanel
          title="Category not found"
          message="This category does not exist, or it is no longer available."
          action={
            <Button asChild className="font-bold">
              <Link href="/categories">Back to categories</Link>
            </Button>
          }
        />
      </div>
    );
  }

  if (creatorsQuery.isError) {
    return (
      <div className="mx-auto max-w-5xl pb-16">
        <ApiStatusPanel
          title="Unable to load creators"
          message={getApiErrorMessage(creatorsQuery.error)}
          action={
            <ApiRetryButton
              onRetry={() => void creatorsQuery.refetch()}
              isRetrying={creatorsQuery.isFetching}
            />
          }
        />
      </div>
    );
  }

  if (liveQuery.isError) {
    return (
      <div className="mx-auto max-w-5xl pb-16">
        <ApiStatusPanel
          title="Unable to load today's clash"
          message={getApiErrorMessage(liveQuery.error)}
          action={<ApiRetryButton onRetry={() => void liveQuery.refetch()} isRetrying={liveQuery.isFetching} />}
        />
      </div>
    );
  }

  if (liveId && leaderboardQuery.isError) {
    return (
      <div className="mx-auto max-w-5xl pb-16">
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
      </div>
    );
  }

  if (
    (creatorsQuery.isPending && !creatorsQuery.data) ||
    (liveId && leaderboardQuery.isPending && !leaderboardQuery.data)
  ) {
    return <CategoryPageSkeleton variant="detail" />;
  }

  const categoryCreatorIds = new Set((creatorsQuery.data?.items ?? []).map((creator) => creator.id));
  const todayLeaders: CategoryListItem[] = (leaderboardQuery.data?.items ?? [])
    .filter((item) => item.creator && categoryCreatorIds.has(item.creator.id))
    .map((item) => ({
      username: item.creator ? resolveCreatorUsername(item.creator) : "",
      displayName: item.creator?.displayName ?? "",
      avatarUrl: item.creator?.avatarUrl ?? item.creator?.user?.avatarUrl ?? "",
      verified: false,
      supportPoints: item.points,
      followers: 0,
      clashRank: item.rank,
    }))
    .filter((item) => item.username.length > 0);

  const allCreators: CategoryListItem[] = (creatorsQuery.data?.items ?? [])
    .slice()
    .sort((left, right) => right.supportTotals.points - left.supportTotals.points)
    .map((creator) => ({
      username: creator.username,
      displayName: creator.displayName,
      avatarUrl: creator.avatarUrl ?? "",
      verified: isPrimarySocialVerified(creator.socialAccounts),
      supportPoints: creator.supportTotals.points,
      followers: 0,
      clashRank: todayLeaders.find((item) => item.username === creator.username)?.clashRank ?? null,
    }));

  return (
    <div className="mx-auto max-w-5xl pb-16">
      <CategoryDetailExperience
        category={category}
        todayLeaders={todayLeaders}
        allCreators={allCreators}
        clashHref={liveClash ? `/clash/${liveClash.slug}` : `/clash/${CURRENT_BATTLE_ID}`}
      />
    </div>
  );
}
