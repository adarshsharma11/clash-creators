import { apiClient } from "@/lib/api/client";
import { toSearchParams } from "@/lib/api/config";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PaginatedResult } from "@/types/api";
import type {
  ClashDetail,
  ClashLeaderboardItem,
  ClashLeaderboardQuery,
  ClashListItem,
  ClashListQuery,
  ClashWinner,
  JoinClashResult,
} from "@/types/clash";

export function getClashes(
  query: ClashListQuery = {},
  signal?: AbortSignal
): Promise<PaginatedResult<ClashListItem>> {
  return apiClient.getPaginated<ClashListItem>(
    `${API_ENDPOINTS.clashes.list}${toSearchParams(query)}`,
    { signal }
  );
}

export function getClash(id: string, signal?: AbortSignal): Promise<ClashDetail> {
  return apiClient.get<ClashDetail>(API_ENDPOINTS.clashes.detail(id), { signal });
}

export function getClashLeaderboard(
  id: string,
  query: ClashLeaderboardQuery = {},
  signal?: AbortSignal
): Promise<PaginatedResult<ClashLeaderboardItem>> {
  return apiClient.getPaginated<ClashLeaderboardItem>(
    `${API_ENDPOINTS.clashes.leaderboard(id)}${toSearchParams(query)}`,
    { signal }
  );
}

export function getClashWinner(id: string, signal?: AbortSignal): Promise<ClashWinner> {
  return apiClient.get<ClashWinner>(API_ENDPOINTS.clashes.winner(id), { signal });
}

export async function getLiveClash(signal?: AbortSignal): Promise<ClashListItem | null> {
  const result = await getClashes({ status: "LIVE", page: 1, limit: 1 }, signal);
  return result.items[0] ?? null;
}

export type JoinClashPayload = {
  username: string;
  platform: string;
};

export function joinClash(
  id: string,
  payload?: JoinClashPayload,
  signal?: AbortSignal
): Promise<JoinClashResult> {
  return apiClient.post<JoinClashResult>(
    API_ENDPOINTS.clashes.join(id),
    payload
      ? {
          username: payload.username,
          platform: payload.platform,
        }
      : undefined,
    { signal }
  );
}
