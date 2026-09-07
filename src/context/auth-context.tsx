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
import { getAuthSession, login as loginRequest, logout as logoutRequest, signup as signupRequest } from "@/lib/api/auth";
import { queryKeys } from "@/lib/api/query-keys";
import { subscribeUnauthorized } from "@/lib/api/session-events";
import { clearUserQueries } from "@/lib/query-invalidation";
import type { AuthLoginInput, AuthSession, AuthSignupInput } from "@/types/auth";

type AuthContextValue = {
  user: AuthSession["user"] | null;
  creatorProfile: AuthSession["creatorProfile"];
  socialAccounts: AuthSession["socialAccounts"];
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  login: (input: AuthLoginInput) => Promise<void>;
  signup: (input: AuthSignupInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthSession | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const EMPTY_SOCIALS: AuthSession["socialAccounts"] = [];

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const sessionQuery = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: ({ signal }) => getAuthSession(signal),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const session = sessionQuery.data ?? null;

  const refreshUser = useCallback(async () => {
    const next = await queryClient.fetchQuery({
      queryKey: queryKeys.auth.me,
      queryFn: ({ signal }) => getAuthSession(signal),
      staleTime: 0,
    });
    return next;
  }, [queryClient]);

  const login = useCallback(
    async (input: AuthLoginInput) => {
      await loginRequest(input);
      await refreshUser();
    },
    [refreshUser]
  );

  const signup = useCallback(
    async (input: AuthSignupInput) => {
      await signupRequest(input);
      await refreshUser();
    },
    [refreshUser]
  );

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // Cookie-clearing should still proceed locally.
    }
    queryClient.setQueryData(queryKeys.auth.me, null);
    clearUserQueries(queryClient);
  }, [queryClient]);

  useEffect(() => {
    return subscribeUnauthorized((scope) => {
      if (scope === "user") {
        queryClient.setQueryData(queryKeys.auth.me, null);
      }
    });
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      creatorProfile: session?.creatorProfile ?? null,
      socialAccounts: session?.socialAccounts ?? EMPTY_SOCIALS,
      isAuthenticated: Boolean(session?.user),
      isLoading: sessionQuery.isPending,
      isInitializing: sessionQuery.isPending,
      login,
      signup,
      logout,
      refreshUser,
    }),
    [login, logout, refreshUser, session, sessionQuery.isPending, signup]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
