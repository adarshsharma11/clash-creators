"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/admin-auth-context";

export function useAdminSignOut() {
  const router = useRouter();
  const { logout } = useAdminAuth();
  const [isPending, setIsPending] = useState(false);

  const signOut = useCallback(() => {
    if (isPending) {
      return;
    }

    setIsPending(true);
    void logout().finally(() => {
      router.replace("/admin/login");
      setIsPending(false);
    });
  }, [isPending, logout, router]);

  return { isPending, signOut };
}
