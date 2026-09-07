import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinClash } from "@/lib/api/clashes";
import { invalidateJoinClashQueries } from "@/lib/query-invalidation";
import { joinClashSchema, type JoinClashInput } from "@/lib/validations/join-clash";

export function useJoinClash() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: JoinClashInput) => {
      const parsed = joinClashSchema.parse(input);
      return joinClash(parsed.clashId, {
        username: parsed.username,
        platform: parsed.platform,
      });
    },
    onSuccess: (result, input) => {
      void invalidateJoinClashQueries(queryClient, {
        username: input.username,
        clashId: result.clash.id,
        clashSlug: result.clash.slug,
      });
    },
  });
}
