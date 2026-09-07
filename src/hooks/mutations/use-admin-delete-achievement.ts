import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAchievement } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";

export function useDeleteAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAchievement(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.achievements.all });
    },
  });
}
