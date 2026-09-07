import { z } from "zod";
import { normalizeJoinUsername } from "@/lib/join-clash";

export const joinClashSchema = z.object({
  clashId: z.string().trim().min(1, "Select a clash to join."),
  username: z
    .string()
    .transform((value) => normalizeJoinUsername(value))
    .pipe(
      z
        .string()
        .min(2, "Enter your creator username.")
        .max(32, "Username must be 32 characters or fewer.")
        .regex(/^[a-zA-Z0-9._]+$/, "Use letters, numbers, periods, or underscores.")
    ),
  platform: z.enum(["INSTAGRAM", "YOUTUBE", "TIKTOK", "X", "FACEBOOK", "TWITCH"]),
});

export type JoinClashInput = z.infer<typeof joinClashSchema>;

export const joinClashIdentitySchema = joinClashSchema.omit({ clashId: true });
