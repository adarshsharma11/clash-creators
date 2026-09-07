import { useQuery, type QueryClient } from "@tanstack/react-query";
import { getSupport } from "@/lib/api/supports";
import { queryKeys } from "@/lib/api/query-keys";
import { retryUnlessNotFound } from "@/lib/query-retry";

export function fetchSupportRecord(queryClient: QueryClient, id: string) {
  return queryClient.fetchQuery({
    queryKey: queryKeys.support.detail(id),
    queryFn: ({ signal }) => getSupport(id, signal),
    staleTime: 0,
  });
}

export function useSupport(id: string, enabled = false) {
  return useQuery({
    queryKey: queryKeys.support.detail(id),
    queryFn: ({ signal }) => getSupport(id, signal),
    enabled: enabled && id.length > 0,
    staleTime: 0,
    retry: retryUnlessNotFound,
  });
}
