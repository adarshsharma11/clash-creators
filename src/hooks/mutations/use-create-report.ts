import { useMutation } from "@tanstack/react-query";
import { createReport } from "@/lib/api/reports";
import { createReportSchema, type CreateReportValues } from "@/lib/validations/report";

export function useCreateReport() {
  return useMutation({
    mutationFn: (input: CreateReportValues) => {
      const parsed = createReportSchema.parse(input);
      return createReport(parsed);
    },
  });
}
