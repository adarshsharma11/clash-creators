import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinClash } from "@/lib/api/clashes";
import { invalidateJoinClashQueries } from "@/lib/query-invalidation";
import { joinClashSchema, type JoinClashInput } from "@/lib/validations/join-clash";

export function useJoinClash(username?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: JoinClashInput) => {
      const parsed = joinClashSchema.parse(input);
      return joinClash(parsed.clashId);
    },
    onSuccess: (result) => {
      void invalidateJoinClashQueries(queryClient, {
        username,
        clashId: result.clash.id,
        clashSlug: result.clash.slug,
      });
    },
  });
}
