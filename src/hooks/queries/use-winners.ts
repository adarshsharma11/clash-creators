import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecentWinners, getWinners } from "@/lib/api/winners";
import { getClashWinner } from "@/lib/api/clashes";
import { queryKeys } from "@/lib/api/query-keys";
import { retryUnlessNotFound } from "@/lib/query-retry";
import type { WinnerListQuery } from "@/types/winner";

export function useRecentWinners() {
  return useQuery({
    queryKey: queryKeys.winners.all,
    queryFn: ({ signal }) => getRecentWinners(signal),
    staleTime: 5 * 60 * 1000,
    retry: retryUnlessNotFound,
  });
}

export function useWinners(query: WinnerListQuery = {}) {
  return useQuery({
    queryKey: queryKeys.winners.list(query),
    queryFn: ({ signal }) => getWinners(query, signal),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
    retry: retryUnlessNotFound,
  });
}

export function useClashWinner(id: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.clashes.winner(id),
    queryFn: ({ signal }) => getClashWinner(id, signal),
    enabled: enabled && id.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: retryUnlessNotFound,
  });
}
