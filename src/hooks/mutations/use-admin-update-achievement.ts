import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAchievement } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import type { UpdateAchievementInput } from "@/types/achievement";

export function useUpdateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAchievementInput }) =>
      updateAchievement(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.achievements.all });
    },
  });
}
