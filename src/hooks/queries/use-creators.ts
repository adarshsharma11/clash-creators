import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCreator,
  getCreatorAchievements,
  getCreatorClashes,
  getCreators,
  getCreatorSupporters,
  getCreatorSupports,
} from "@/lib/api/creators";
import { queryKeys } from "@/lib/api/query-keys";
import { retryUnlessNotFound } from "@/lib/query-retry";
import type { CreatorClashQuery, CreatorListQuery } from "@/types/creator";

const CREATOR_STALE_TIME = 30 * 1000;
const CREATOR_LIST_STALE_TIME = 60 * 1000;
const ACHIEVEMENT_STALE_TIME = 5 * 60 * 1000;

export function useCreators(query: CreatorListQuery = {}) {
  return useQuery({
    queryKey: queryKeys.creators.list(query),
    queryFn: ({ signal }) => getCreators(query, signal),
    staleTime: CREATOR_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
    retry: retryUnlessNotFound,
  });
}

export function useCreator(username: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.creators.detail(username),
    queryFn: ({ signal }) => getCreator(username, signal),
    enabled: enabled && username.length > 0,
    staleTime: CREATOR_STALE_TIME,
    retry: retryUnlessNotFound,
  });
}

export function useCreatorClashes(username: string, query: CreatorClashQuery = {}, enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.creators.clashes(username), query] as const,
    queryFn: ({ signal }) => getCreatorClashes(username, query, signal),
    enabled: enabled && username.length > 0,
    staleTime: CREATOR_LIST_STALE_TIME,
    retry: retryUnlessNotFound,
  });
}

export function useCreatorSupporters(username: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.creators.supporters(username),
    queryFn: ({ signal }) => getCreatorSupporters(username, { page: 1, limit: 8 }, signal),
    enabled: enabled && username.length > 0,
    staleTime: CREATOR_STALE_TIME,
    retry: retryUnlessNotFound,
  });
}

export function useCreatorSupports(username: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.creators.supports(username),
    queryFn: ({ signal }) => getCreatorSupports(username, { page: 1, limit: 20 }, signal),
    enabled: enabled && username.length > 0,
    staleTime: CREATOR_STALE_TIME,
    retry: retryUnlessNotFound,
  });
}

export function useCreatorAchievements(username: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.creators.achievements(username),
    queryFn: ({ signal }) => getCreatorAchievements(username, signal),
    enabled: enabled && username.length > 0,
    staleTime: ACHIEVEMENT_STALE_TIME,
    retry: retryUnlessNotFound,
  });
}

export function usePrefetchCreator() {
  const queryClient = useQueryClient();

  return (username: string) => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.creators.detail(username),
      queryFn: ({ signal }) => getCreator(username, signal),
      staleTime: CREATOR_STALE_TIME,
    });
  };
}

export function usePrefetchCreatorList() {
  const queryClient = useQueryClient();

  return (query: CreatorListQuery = {}) => {
    void queryClient.prefetchQuery({
      queryKey: queryKeys.creators.list(query),
      queryFn: ({ signal }) => getCreators(query, signal),
      staleTime: CREATOR_LIST_STALE_TIME,
    });
  };
}
