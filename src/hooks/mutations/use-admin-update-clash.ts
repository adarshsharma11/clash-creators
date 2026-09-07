import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClash } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import type { UpdateClashInput } from "@/types/clash";

export function useUpdateClash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateClashInput }) => updateClash(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.clashes.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
  });
}
