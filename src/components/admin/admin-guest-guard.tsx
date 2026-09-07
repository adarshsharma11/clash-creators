"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/admin-auth-context";

export function AdminGuestGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isAuthenticated, isInitializing, router]);

  if (isInitializing || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return children;
}
