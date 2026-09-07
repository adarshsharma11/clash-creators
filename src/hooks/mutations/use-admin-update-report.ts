import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateReport } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import type { UpdateReportInput } from "@/types/report";

export function useUpdateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReportInput }) =>
      updateReport(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.reports.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard });
    },
  });
}
