import { z } from "zod";

export const createSupportSchema = z.object({
  clashId: z.string().trim().min(1, "A clash is required."),
  creatorId: z.string().trim().min(1, "A creator is required."),
  points: z.number().int().positive("Support points must be a positive number."),
});

export type CreateSupportInput = z.infer<typeof createSupportSchema>;
