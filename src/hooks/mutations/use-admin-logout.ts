import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLogout } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import { clearAdminQueries } from "@/lib/query-invalidation";

export function useAdminLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => adminLogout(),
    onSettled: () => {
      queryClient.setQueryData(queryKeys.admin.me, null);
      clearAdminQueries(queryClient);
    },
  });
}
