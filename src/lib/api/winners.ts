import { apiClient } from "@/lib/api/client";
import { toSearchParams } from "@/lib/api/config";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { resolveCreatorUsername } from "@/lib/clash-view";
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

export function toHallOfFameWinner(winner: WinnerListItem): HallOfFameWinner | null {
  if (!winner.creator) {
    return null;
  }

  const username = resolveCreatorUsername(winner.creator);
  if (!username && !winner.creator.displayName) {
    return null;
  }

  return {
    id: `${winner.clash.id}-${winner.creator.id}`,
    date: formatShortDate(winner.clash.endsAt || winner.createdAt),
    creator: {
      username: username || winner.creator.displayName,
      displayName: winner.creator.displayName,
      avatarUrl: winner.creator.avatarUrl ?? winner.creator.user?.avatarUrl ?? null,
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
  return result.items
    .map(toHallOfFameWinner)
    .filter((winner): winner is HallOfFameWinner => winner !== null);
}
