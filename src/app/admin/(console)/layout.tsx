import type { ReactNode } from "react";
import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";

export default function AdminConsoleLayout({ children }: { children: ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
