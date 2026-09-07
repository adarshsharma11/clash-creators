import type { Metadata } from "next";
import { AdminReportsPanel } from "@/components/admin/admin-reports-panel";

export const metadata: Metadata = { title: "Reports" };

export default function AdminReportsPage() {
  return <AdminReportsPanel />;
}
