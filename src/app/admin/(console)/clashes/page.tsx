import type { Metadata } from "next";
import { AdminClashesPanel } from "@/components/admin/admin-clashes-panel";

export const metadata: Metadata = { title: "Clashes" };

export default function AdminClashesPage() {
  return <AdminClashesPanel />;
}
