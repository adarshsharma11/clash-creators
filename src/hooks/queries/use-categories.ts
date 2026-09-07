import { useQuery } from "@tanstack/react-query";
import { getCategories, getCategory } from "@/lib/api/categories";
import { queryKeys } from "@/lib/api/query-keys";
import { retryUnlessNotFound } from "@/lib/query-retry";
import type { Category } from "@/types/category";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: queryKeys.categories.all,
    queryFn: ({ signal }) => getCategories(signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useCategory(slug: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.categories.detail(slug),
    queryFn: ({ signal }) => getCategory(slug, signal),
    enabled: enabled && slug.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: retryUnlessNotFound,
  });
}
