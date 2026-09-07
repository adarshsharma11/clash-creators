import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyCreatorProfile, upsertMySocialAccount } from "@/lib/api/creators";
import { queryKeys } from "@/lib/api/query-keys";
import {
  updateCreatorProfileSchema,
  upsertCreatorSocialSchema,
  type UpdateCreatorProfileValues,
  type UpsertCreatorSocialValues,
} from "@/lib/validations/creator";

export function useUpdateMyCreatorProfile(username?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateCreatorProfileValues) => {
      const parsed = updateCreatorProfileSchema.parse(input);
      return updateMyCreatorProfile({
        displayName: parsed.displayName,
        bio: parsed.bio || null,
        avatarUrl: parsed.avatarUrl || null,
        categoryId: parsed.categoryId || null,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      await queryClient.invalidateQueries({ queryKey: queryKeys.creators.me });
      if (username) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.creators.detail(username) });
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.creators.all });
    },
  });
}

export function useUpsertMySocialAccount(username?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpsertCreatorSocialValues) => {
      const parsed = upsertCreatorSocialSchema.parse(input);
      return upsertMySocialAccount({
        platform: parsed.platform,
        username: parsed.username || null,
        displayName: parsed.displayName || null,
        profileUrl: parsed.profileUrl,
        isPrimary: parsed.isPrimary,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      if (username) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.creators.detail(username) });
      }
    },
  });
}
