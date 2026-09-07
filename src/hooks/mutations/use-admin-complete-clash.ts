import { useMutation, useQueryClient } from "@tanstack/react-query";
import { completeClash } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";

export function useCompleteClash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => completeClash(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.clashes.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.auditLogs.all });
    },
  });
}
