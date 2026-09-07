import type { Metadata } from "next";
import { AdminAuditLogsPanel } from "@/components/admin/admin-audit-logs-panel";

export const metadata: Metadata = { title: "Audit logs" };

export default function AdminAuditLogsPage() {
  return <AdminAuditLogsPanel />;
}
