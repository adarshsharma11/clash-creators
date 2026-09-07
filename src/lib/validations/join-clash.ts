import { z } from "zod";

export const joinClashSchema = z.object({
  clashId: z.string().trim().min(1, "Select a clash to join."),
});

export type JoinClashInput = z.infer<typeof joinClashSchema>;
