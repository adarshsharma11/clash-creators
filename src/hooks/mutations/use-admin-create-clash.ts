import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClash } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import type { CreateClashInput } from "@/types/clash";

export function useCreateClash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateClashInput) => createClash(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.clashes.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
  });
}
