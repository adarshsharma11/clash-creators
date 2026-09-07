import { useQuery } from "@tanstack/react-query";
import { getAdminCategories } from "@/lib/api/categories";
import { queryKeys } from "@/lib/api/query-keys";
import { useAdminAuth } from "@/context/admin-auth-context";

export function useAdminCategories() {
  const { isAuthenticated } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.admin.categories.all,
    queryFn: ({ signal }) => getAdminCategories(signal),
    enabled: isAuthenticated,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
