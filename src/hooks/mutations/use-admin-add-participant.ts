import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addClashParticipant } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";

export function useAddClashParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      username,
      platform,
    }: {
      id: string;
      username: string;
      platform: string;
    }) => addClashParticipant(id, { username, platform }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.clashes.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
      void queryClient.invalidateQueries({ queryKey: queryKeys.clashes.all });
    },
  });
}
