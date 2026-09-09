import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { CreateSupportInput } from "@/lib/validations/support";
import type { CreateSupportResponse, SupportRecord } from "@/types/support";

export function createSupport(
  input: CreateSupportInput,
  options: { signal?: AbortSignal; idempotencyKey?: string } = {}
): Promise<CreateSupportResponse> {
  const headers = options.idempotencyKey
    ? { "Idempotency-Key": options.idempotencyKey }
    : undefined;

  return apiClient.post<CreateSupportResponse>(API_ENDPOINTS.supports.create, input, {
    signal: options.signal,
    headers,
  });
}

export function getSupport(id: string, signal?: AbortSignal): Promise<SupportRecord> {
  return apiClient.get<SupportRecord>(API_ENDPOINTS.supports.detail(id), { signal });
}

export function confirmDemoSupport(id: string, signal?: AbortSignal): Promise<SupportRecord> {
  return apiClient.post<SupportRecord>(API_ENDPOINTS.supports.confirmDemo(id), undefined, { signal });
}
