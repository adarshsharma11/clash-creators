import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import { useAdminAuth } from "@/context/admin-auth-context";

export function useAdminDashboard() {
  const { isAuthenticated } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.admin.dashboard,
    queryFn: ({ signal }) => getAdminDashboard(signal),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
