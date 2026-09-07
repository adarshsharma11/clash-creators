import type { Metadata } from "next";
import { AdminSupportsPanel } from "@/components/admin/admin-supports-panel";

export const metadata: Metadata = { title: "Supports" };

export default function AdminSupportsPage() {
  return <AdminSupportsPanel />;
}
