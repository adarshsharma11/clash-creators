import { useQuery } from "@tanstack/react-query";
import { getAdminReports } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import { useAdminAuth } from "@/context/admin-auth-context";
import type { AdminReportQuery } from "@/types/admin";

export function useAdminReports(query: AdminReportQuery = {}) {
  const { isAuthenticated } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.admin.reports.list(query),
    queryFn: ({ signal }) => getAdminReports(query, signal),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
