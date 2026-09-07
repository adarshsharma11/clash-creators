import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminAuthProvider } from "@/context/admin-auth-context";

export const metadata: Metadata = {
  title: {
    default: "Admin — ClashCreators",
    template: "%s — ClashCreators Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
