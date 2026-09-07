import type { Metadata } from "next";
import { AdminAchievementsPanel } from "@/components/admin/admin-achievements-panel";

export const metadata: Metadata = { title: "Achievements" };

export default function AdminAchievementsPage() {
  return <AdminAchievementsPanel />;
}
