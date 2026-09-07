import { useQuery } from "@tanstack/react-query";
import { getAdminAuditLogs } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import { useAdminAuth } from "@/context/admin-auth-context";
import type { AuditLogQuery } from "@/types/admin";

export function useAdminAuditLogs(query: AuditLogQuery = {}) {
  const { isAuthenticated } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.admin.auditLogs.list(query),
    queryFn: ({ signal }) => getAdminAuditLogs(query, signal),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
