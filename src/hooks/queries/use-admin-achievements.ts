import { useQuery } from "@tanstack/react-query";
import { getAdminAchievements } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import { useAdminAuth } from "@/context/admin-auth-context";

export function useAdminAchievements() {
  const { isAuthenticated } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.admin.achievements.all,
    queryFn: ({ signal }) => getAdminAchievements(signal),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
