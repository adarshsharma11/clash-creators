import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/query-keys";
import type { AuthSignupInput } from "@/types/auth";

export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AuthSignupInput) => signup(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
