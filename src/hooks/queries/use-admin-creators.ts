import { useQuery } from "@tanstack/react-query";
import { getAdminCreators } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import { useAdminAuth } from "@/context/admin-auth-context";
import type { AdminCreatorQuery } from "@/types/admin";

export function useAdminCreators(query: AdminCreatorQuery = {}) {
  const { isAuthenticated } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.admin.creators.list(query),
    queryFn: ({ signal }) => getAdminCreators(query, signal),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
