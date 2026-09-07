import { z } from "zod";
import type { ReportReason } from "@/types/report";

export const REPORT_REASONS: ReportReason[] = [
  "SPAM",
  "HARASSMENT",
  "FAKE_ACCOUNT",
  "INAPPROPRIATE_CONTENT",
  "FRAUD",
  "OTHER",
];

export const createReportSchema = z
  .object({
    creatorId: z.string().trim().min(1).optional(),
    clashId: z.string().trim().min(1).optional(),
    reason: z.enum(["SPAM", "HARASSMENT", "FAKE_ACCOUNT", "INAPPROPRIATE_CONTENT", "FRAUD", "OTHER"]),
    description: z.string().trim().max(1000).optional(),
  })
  .refine((data) => Boolean(data.creatorId || data.clashId), {
    message: "A report must target a creator or a clash",
    path: ["creatorId"],
  });

export type CreateReportValues = z.infer<typeof createReportSchema>;
