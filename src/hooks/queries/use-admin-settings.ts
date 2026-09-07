import { useQuery } from "@tanstack/react-query";
import { getAdminSettings } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import { useAdminAuth } from "@/context/admin-auth-context";
import { canManageSettings } from "@/lib/admin-permissions";

export function useAdminSettings() {
  const { isAuthenticated, admin } = useAdminAuth();

  return useQuery({
    queryKey: queryKeys.admin.settings.all,
    queryFn: ({ signal }) => getAdminSettings(signal),
    enabled: isAuthenticated && canManageSettings(admin?.role),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
