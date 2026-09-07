import { z } from "zod";

export const updateCreatorProfileSchema = z.object({
  displayName: z.string().trim().min(2, "Display name must be at least 2 characters").max(80),
  bio: z.string().trim().max(500).optional().or(z.literal("")),
  avatarUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || /^https?:\/\//.test(value), "Enter a valid URL"),
  categoryId: z.string().trim().min(1).optional().or(z.literal("")),
});

export const upsertCreatorSocialSchema = z.object({
  platform: z.enum(["INSTAGRAM", "YOUTUBE", "TIKTOK", "X", "FACEBOOK", "TWITCH"]),
  username: z.string().trim().max(80).optional().or(z.literal("")),
  displayName: z.string().trim().max(80).optional().or(z.literal("")),
  profileUrl: z.string().trim().url("Enter a valid profile URL").max(500),
  isPrimary: z.boolean().optional(),
});

export type UpdateCreatorProfileValues = z.infer<typeof updateCreatorProfileSchema>;
export type UpsertCreatorSocialValues = z.infer<typeof upsertCreatorSocialSchema>;
