import { apiClient } from "@/lib/api/client";
import { toSearchParams } from "@/lib/api/config";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { PaginatedResult } from "@/types/api";
import type {
  CreatorAchievement,
  CreatorClashItem,
  CreatorClashQuery,
  CreatorDetail,
  CreatorListItem,
  CreatorListQuery,
  CreatorSupportItem,
  CreatorSupporter,
  UpdateCreatorProfileInput,
  UpsertCreatorSocialInput,
  CreatorSocialAccount,
} from "@/types/creator";

type CreatorAchievementRow = {
  earnedAt: string;
  achievement: Omit<CreatorAchievement, "earnedAt">;
};

export function getCreators(
  query: CreatorListQuery = {},
  signal?: AbortSignal
): Promise<PaginatedResult<CreatorListItem>> {
  return apiClient.getPaginated<CreatorListItem>(
    `${API_ENDPOINTS.creators.list}${toSearchParams(query)}`,
    { signal }
  );
}

export function getCreator(username: string, signal?: AbortSignal): Promise<CreatorDetail> {
  return apiClient.get<CreatorDetail>(API_ENDPOINTS.creators.detail(username), { signal });
}

export function updateMyCreatorProfile(
  input: UpdateCreatorProfileInput,
  signal?: AbortSignal
): Promise<CreatorDetail> {
  return apiClient.patch<CreatorDetail>(API_ENDPOINTS.creators.me, input, { signal });
}

export function upsertMySocialAccount(
  input: UpsertCreatorSocialInput,
  signal?: AbortSignal
): Promise<CreatorSocialAccount> {
  return apiClient.put<CreatorSocialAccount>(API_ENDPOINTS.creators.socials, input, { signal });
}

export function getCreatorClashes(
  username: string,
  query: CreatorClashQuery = {},
  signal?: AbortSignal
): Promise<PaginatedResult<CreatorClashItem>> {
  return apiClient.getPaginated<CreatorClashItem>(
    `${API_ENDPOINTS.creators.clashes(username)}${toSearchParams(query)}`,
    { signal }
  );
}

export function getCreatorSupporters(
  username: string,
  query: { page?: number; limit?: number } = {},
  signal?: AbortSignal
): Promise<PaginatedResult<CreatorSupporter>> {
  return apiClient.getPaginated<CreatorSupporter>(
    `${API_ENDPOINTS.creators.supporters(username)}${toSearchParams(query)}`,
    { signal }
  );
}

export function getCreatorSupports(
  username: string,
  query: { page?: number; limit?: number } = {},
  signal?: AbortSignal
): Promise<PaginatedResult<CreatorSupportItem>> {
  return apiClient.getPaginated<CreatorSupportItem>(
    `${API_ENDPOINTS.creators.supports(username)}${toSearchParams(query)}`,
    { signal }
  );
}

export async function getCreatorAchievements(
  username: string,
  signal?: AbortSignal
): Promise<CreatorAchievement[]> {
  const rows = await apiClient.get<CreatorAchievementRow[]>(
    API_ENDPOINTS.creators.achievements(username),
    { signal }
  );

  return rows.map((row) => ({
    ...row.achievement,
    earnedAt: row.earnedAt,
  }));
}
