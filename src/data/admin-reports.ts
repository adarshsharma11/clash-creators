import type { AdminReportRow } from "@/types/admin";

export const adminReports: AdminReportRow[] = [
  {
    id: "rep_demo_001",
    creatorUsername: "street_style",
    creatorName: "Marcus Fashion",
    reason: "Impersonation",
    reporter: "fan_report_12",
    status: "pending",
    createdAt: "2026-09-07T05:30:00.000Z",
  },
  {
    id: "rep_demo_002",
    creatorUsername: "ai_explorer",
    creatorName: "Dr. AI",
    reason: "Spam in clash comments",
    reporter: "mod_queue",
    status: "reviewed",
    createdAt: "2026-09-06T19:44:00.000Z",
  },
  {
    id: "rep_demo_003",
    creatorUsername: "chef_maria",
    creatorName: "Maria Cooks",
    reason: "Misleading category",
    reporter: "sarah_fitness",
    status: "resolved",
    createdAt: "2026-09-05T14:02:00.000Z",
  },
  {
    id: "rep_demo_004",
    creatorUsername: "glam_by_chloe",
    creatorName: "Chloe Beauty",
    reason: "Duplicate listing",
    reporter: "system",
    status: "rejected",
    createdAt: "2026-09-04T11:18:00.000Z",
  },
];
