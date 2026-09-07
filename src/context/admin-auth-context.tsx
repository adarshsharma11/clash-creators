"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminLogin, adminLogout, getAdminSession } from "@/lib/api/admin";
import { queryKeys } from "@/lib/api/query-keys";
import { subscribeUnauthorized } from "@/lib/api/session-events";
import { clearAdminQueries } from "@/lib/query-invalidation";
import type { AdminLoginInput, AdminSession } from "@/types/auth";

type AdminAuthContextValue = {
  admin: AdminSession | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  login: (input: AdminLoginInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshAdmin: () => Promise<AdminSession | null>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: queryKeys.admin.me,
    queryFn: ({ signal }) => getAdminSession(signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const admin = sessionQuery.data ?? null;

  const refreshAdmin = useCallback(async () => {
    const next = await queryClient.fetchQuery({
      queryKey: queryKeys.admin.me,
      queryFn: ({ signal }) => getAdminSession(signal),
      staleTime: 0,
    });
    return next;
  }, [queryClient]);

  const login = useCallback(
    async (input: AdminLoginInput) => {
      await adminLogin(input);
      await refreshAdmin();
    },
    [refreshAdmin]
  );

  const logout = useCallback(async () => {
    try {
      await adminLogout();
    } catch {
      // Cookie-clearing should still proceed locally.
    }
    queryClient.setQueryData(queryKeys.admin.me, null);
    clearAdminQueries(queryClient);
  }, [queryClient]);

  useEffect(() => {
    return subscribeUnauthorized((scope) => {
      if (scope === "admin") {
        queryClient.setQueryData(queryKeys.admin.me, null);
      }
    });
  }, [queryClient]);

  const isAuthenticated = admin !== null;
  const value = useMemo<AdminAuthContextValue>(
    () => ({
      admin,
      isAuthenticated,
      isAdminAuthenticated: isAuthenticated,
      isLoading: sessionQuery.isPending,
      isInitializing: sessionQuery.isPending,
      login,
      logout,
      refreshAdmin,
    }),
    [admin, isAuthenticated, login, logout, refreshAdmin, sessionQuery.isPending]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
