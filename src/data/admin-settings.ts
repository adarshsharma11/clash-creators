import type { AdminSettings } from "@/types/admin";

export const defaultAdminSettings: AdminSettings = {
  siteName: "ClashCreators",
  defaultSupportPoints: 100,
  minimumSupportPoints: 10,
  clashDurationHours: 24,
  maintenanceMode: false,
};
