import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Achievement } from "@/types/achievement";

export function getAchievements(signal?: AbortSignal): Promise<Achievement[]> {
  return apiClient.get<Achievement[]>(API_ENDPOINTS.achievements, { signal });
}
