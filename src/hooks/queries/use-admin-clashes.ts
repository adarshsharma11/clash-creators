import { useQuery } from "@tanstack/react-query";
import { getAdminClashes } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import { useAdminAuth } from "@/context/admin-auth-context";
import type { AdminClashQuery } from "@/types/admin";

export function useAdminClashes(query: AdminClashQuery = {}) {
  const { isAuthenticated } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.admin.clashes.list(query),
    queryFn: ({ signal }) => getAdminClashes(query, signal),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
