import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLogin } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import type { AdminLoginInput } from "@/types/auth";

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AdminLoginInput) => adminLogin(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.admin.me });
    },
  });
}
