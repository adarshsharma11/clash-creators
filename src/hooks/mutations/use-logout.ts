import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/query-keys";
import { clearUserQueries } from "@/lib/query-invalidation";

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logout(),
    onSettled: () => {
      queryClient.setQueryData(queryKeys.auth.me, null);
      clearUserQueries(queryClient);
    },
  });
}
