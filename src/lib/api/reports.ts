import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CreatedReport, CreateReportInput } from "@/types/report";

export function createReport(input: CreateReportInput, signal?: AbortSignal): Promise<CreatedReport> {
  return apiClient.post<CreatedReport>(API_ENDPOINTS.reports.create, input, { signal });
}
