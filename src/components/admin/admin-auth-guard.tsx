"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminAuth } from "@/context/admin-auth-context";
import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";
import { PageLoader } from "@/components/ui/page-loader";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isAuthenticated, isInitializing, router, pathname]);

  if (isInitializing && !isAuthenticated) {
    return (
      <PageLoader label="Checking admin session">
        <div className="min-h-screen p-6">
          <SkeletonText className="mb-6 h-6 w-40" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-24" />
            <SkeletonCard className="h-24" />
          </div>
          <Skeleton className="mt-6 h-64 w-full rounded-2xl" />
        </div>
      </PageLoader>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageLoader label="Redirecting to admin login">
        <div className="min-h-screen p-6">
          <SkeletonText className="mb-6 h-6 w-40" />
        </div>
      </PageLoader>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
