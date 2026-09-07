import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAchievement } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import type { CreateAchievementInput } from "@/types/achievement";

export function useCreateAchievement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAchievementInput) => createAchievement(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.achievements.all });
    },
  });
}
