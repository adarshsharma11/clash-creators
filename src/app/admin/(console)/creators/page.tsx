import type { Metadata } from "next";
import { AdminCreatorsPanel } from "@/components/admin/admin-creators-panel";

export const metadata: Metadata = { title: "Creators" };

export default function AdminCreatorsPage() {
  return <AdminCreatorsPanel />;
}
