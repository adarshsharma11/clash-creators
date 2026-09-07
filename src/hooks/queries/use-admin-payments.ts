import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAdminPayments } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import { useAdminAuth } from "@/context/admin-auth-context";
import type { AdminPaymentQuery } from "@/types/admin";

export function useAdminPayments(query: AdminPaymentQuery = {}) {
  const { isAuthenticated } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.admin.payments.list(query),
    queryFn: ({ signal }) => getAdminPayments(query, signal),
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
