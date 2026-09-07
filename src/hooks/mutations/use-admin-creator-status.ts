import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCreatorStatus } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import type { CreatorStatus } from "@/types/admin";

export function useUpdateCreatorStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CreatorStatus }) =>
      updateCreatorStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.creators.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
  });
}
