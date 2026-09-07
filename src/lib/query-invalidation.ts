import type { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/query-keys";

export async function invalidateConfirmedSupportQueries(
  queryClient: QueryClient,
  input: {
    username: string;
    clashId?: string;
    clashSlug?: string;
    categorySlug?: string;
  }
) {
  const tasks = [
    queryClient.invalidateQueries({ queryKey: queryKeys.creators.detail(input.username) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.creators.supporters(input.username) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.creators.supports(input.username) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.creators.clashes(input.username) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.creators.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.clashes.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.clashes.live }),
    queryClient.invalidateQueries({ queryKey: queryKeys.categories.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.winners.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.homepage.counters }),
  ];

  if (input.clashId) {
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.clashes.detail(input.clashId) }));
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.clashes.leaderboard(input.clashId) }));
  }

  if (input.clashSlug && input.clashSlug !== input.clashId) {
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.clashes.detail(input.clashSlug) }));
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.clashes.leaderboard(input.clashSlug) }));
  }

  if (input.categorySlug) {
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.categories.detail(input.categorySlug) }));
  }

  await Promise.all(tasks);
}

export async function invalidateJoinClashQueries(
  queryClient: QueryClient,
  input: { username?: string; clashId: string; clashSlug?: string }
) {
  const tasks = [
    queryClient.invalidateQueries({ queryKey: queryKeys.clashes.detail(input.clashId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.clashes.leaderboard(input.clashId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.clashes.live }),
    queryClient.invalidateQueries({ queryKey: queryKeys.clashes.all }),
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.me }),
    queryClient.invalidateQueries({ queryKey: queryKeys.creators.all }),
  ];

  if (input.clashSlug && input.clashSlug !== input.clashId) {
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.clashes.detail(input.clashSlug) }));
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.clashes.leaderboard(input.clashSlug) }));
  }

  if (input.username) {
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.creators.detail(input.username) }));
    tasks.push(queryClient.invalidateQueries({ queryKey: queryKeys.creators.clashes(input.username) }));
  }

  await Promise.all(tasks);
}

export function clearUserQueries(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: queryKeys.auth.me });
  queryClient.removeQueries({ queryKey: queryKeys.creators.me });
  queryClient.removeQueries({ queryKey: ["support"] });
}

export function clearAdminQueries(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: ["admin"] });
}