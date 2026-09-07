import { apiClient } from "@/lib/api/client";
import { toSearchParams } from "@/lib/api/config";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { formatShortDate } from "@/lib/formatters";
import type { PaginatedResult } from "@/types/api";
import type { HallOfFameWinner, WinnerListItem, WinnerListQuery } from "@/types/winner";

export function getWinners(
  query: WinnerListQuery = {},
  signal?: AbortSignal
): Promise<PaginatedResult<WinnerListItem>> {
  return apiClient.getPaginated<WinnerListItem>(
    `${API_ENDPOINTS.winners.list}${toSearchParams(query)}`,
    { signal }
  );
}

export function toHallOfFameWinner(winner: WinnerListItem): HallOfFameWinner {
  return {
    id: `${winner.clash.id}-${winner.creator.id}`,
    date: formatShortDate(winner.clash.endsAt || winner.createdAt),
    creator: {
      username: winner.creator.user.username,
      displayName: winner.creator.displayName,
      avatarUrl: winner.creator.avatarUrl ?? winner.creator.user.avatarUrl,
    },
    supportPoints: winner.points,
    title: winner.clash.category?.name ? `${winner.clash.category.name} Champion` : winner.clash.title,
    clashTitle: winner.clash.title,
    clashSlug: winner.clash.slug,
    categoryName: winner.clash.category?.name,
  };
}

export async function getRecentWinners(signal?: AbortSignal): Promise<HallOfFameWinner[]> {
  const result = await getWinners({ page: 1, limit: 6 }, signal);
  return result.items.map(toHallOfFameWinner);
}
