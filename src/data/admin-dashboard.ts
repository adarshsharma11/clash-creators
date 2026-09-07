import type { AdminActivity, AdminDashboardStats } from "@/types/admin";

export const adminDashboardStats: AdminDashboardStats = {
  totalCreators: 1284,
  activeClashes: 12,
  todaySupportPoints: 94820,
  todaySupports: 2481,
};

export const adminActivity: AdminActivity[] = [
  {
    id: "act_1",
    type: "join",
    message: "@alex_carter joined Gaming Clash",
    timestamp: "2026-09-07T06:12:00.000Z",
  },
  {
    id: "act_2",
    type: "support",
    message: "@sarah_fitness received 500 support points",
    timestamp: "2026-09-07T05:48:00.000Z",
  },
  {
    id: "act_3",
    type: "clash",
    message: "Gaming Clash started",
    timestamp: "2026-09-06T18:00:00.000Z",
  },
  {
    id: "act_4",
    type: "rank",
    message: "@mikemakesjokes moved to #1",
    timestamp: "2026-09-07T04:21:00.000Z",
  },
  {
    id: "act_5",
    type: "clash",
    message: "Fitness Clash ended",
    timestamp: "2026-09-07T02:10:00.000Z",
  },
];
