import { z } from "zod";

const slugPattern = /^[a-z0-9-]+$/;

export const createClashSchema = z
  .object({
    title: z.string().trim().min(2, "Title must be at least 2 characters").max(160),
    slug: z
      .string()
      .trim()
      .min(2, "Slug must be at least 2 characters")
      .max(160)
      .regex(slugPattern, "Use lowercase letters, numbers, and hyphens"),
    description: z.string().trim().max(2000).optional().or(z.literal("")),
    categoryId: z.string().trim().min(1, "Category is required"),
    startsAt: z.string().min(1, "Start time is required"),
    endsAt: z.string().min(1, "End time is required"),
    maxParticipants: z.string().optional(),
  })
  .refine((data) => new Date(data.endsAt).getTime() > new Date(data.startsAt).getTime(), {
    message: "End time must be after start time",
    path: ["endsAt"],
  });

export const createAchievementSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(80)
    .regex(slugPattern, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().trim().max(400).optional().or(z.literal("")),
  icon: z.string().trim().max(80).optional().or(z.literal("")),
});

export const updateAchievementSchema = createAchievementSchema.partial();

export type CreateClashValues = z.infer<typeof createClashSchema>;
export type CreateAchievementValues = z.infer<typeof createAchievementSchema>;
