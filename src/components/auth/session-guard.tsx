"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { subscribeUnauthorized } from "@/lib/api/session-events";

function isProtectedUserPath(pathname: string): boolean {
  return pathname.startsWith("/support/");
}

export function SessionGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    return subscribeUnauthorized((scope) => {
      if (scope === "user" && isProtectedUserPath(pathname)) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      }
    });
  }, [pathname, router]);

  return null;
}
