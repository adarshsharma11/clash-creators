import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { getClash, getClashLeaderboard, getClashes, getLiveClash } from "@/lib/api/clashes";
import { queryKeys } from "@/lib/api/query-keys";
import { mergeJoinableClashes } from "@/lib/join-clash-flow";
import { retryUnlessNotFound } from "@/lib/query-retry";
import type { ClashLeaderboardQuery, ClashListQuery } from "@/types/clash";

const LIVE_STALE_TIME = 15 * 1000;
const CLASH_STALE_TIME = 30 * 1000;
const CLASH_LIST_STALE_TIME = 60 * 1000;

export function useClashes(query: ClashListQuery = {}) {
  return useQuery({
    queryKey: queryKeys.clashes.list(query),
    queryFn: ({ signal }) => getClashes(query, signal),
    staleTime: CLASH_LIST_STALE_TIME,
    retry: retryUnlessNotFound,
  });
}

export function useLiveClash() {
  return useQuery({
    queryKey: queryKeys.clashes.live,
    queryFn: ({ signal }) => getLiveClash(signal),
    staleTime: LIVE_STALE_TIME,
    refetchInterval: LIVE_STALE_TIME,
    retry: retryUnlessNotFound,
  });
}

export function useAvailableClashes() {
  const liveQuery = useLiveClash();
  const upcomingQuery = useClashes({ status: "UPCOMING", page: 1, limit: 50 });

  return {
    liveClash: liveQuery.data ?? null,
    clashes: mergeJoinableClashes(liveQuery.data, upcomingQuery.data?.items ?? []),
    isPending: liveQuery.isPending || upcomingQuery.isPending,
    isError: liveQuery.isError || upcomingQuery.isError,
    isFetching: liveQuery.isFetching || upcomingQuery.isFetching,
    error: liveQuery.error ?? upcomingQuery.error,
    refetch: async () => {
      await Promise.all([liveQuery.refetch(), upcomingQuery.refetch()]);
    },
  };
}

export function useClash(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.clashes.detail(id),
    queryFn: ({ signal }) => getClash(id, signal),
    enabled: enabled && id.length > 0,
    staleTime: CLASH_STALE_TIME,
    retry: retryUnlessNotFound,
  });
}

export function useClashLeaderboard(id: string, query: ClashLeaderboardQuery = { limit: 50 }, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.clashes.leaderboard(id), query] as const,
    queryFn: ({ signal }) => getClashLeaderboard(id, query, signal),
    enabled: enabled && id.length > 0,
    staleTime: LIVE_STALE_TIME,
    refetchInterval: LIVE_STALE_TIME,
    retry: retryUnlessNotFound,
  });
}

export function fetchClashLeaderboard(
  queryClient: QueryClient,
  id: string,
  query: ClashLeaderboardQuery = { limit: 50 }
) {
  return queryClient.fetchQuery({
    queryKey: [...queryKeys.clashes.leaderboard(id), query] as const,
    queryFn: ({ signal }) => getClashLeaderboard(id, query, signal),
    staleTime: 0,
  });
}

export function usePrefetchClash() {
  const queryClient = useQueryClient();

  return (id: string) => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.clashes.detail(id),
      queryFn: ({ signal }) => getClash(id, signal),
      staleTime: CLASH_STALE_TIME,
    });
    void queryClient.prefetchQuery({
      queryKey: [...queryKeys.clashes.leaderboard(id), { limit: 50 }] as const,
      queryFn: ({ signal }) => getClashLeaderboard(id, { limit: 50 }, signal),
      staleTime: LIVE_STALE_TIME,
    });
  };
}
