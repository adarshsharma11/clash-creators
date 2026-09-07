import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiError } from "@/types/api";
import type { AuthLoginInput, AuthSession, AuthSignupInput, AuthUser } from "@/types/auth";

export async function getAuthSession(signal?: AbortSignal): Promise<AuthSession | null> {
  try {
    return await apiClient.get<AuthSession>(API_ENDPOINTS.auth.me, { signal });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }

    throw error;
  }
}

export function signup(input: AuthSignupInput, signal?: AbortSignal): Promise<AuthUser> {
  return apiClient.post<AuthUser>(API_ENDPOINTS.auth.signup, input, { signal });
}

export function login(input: AuthLoginInput, signal?: AbortSignal): Promise<AuthUser> {
  return apiClient.post<AuthUser>(API_ENDPOINTS.auth.login, input, { signal });
}

export function logout(signal?: AbortSignal): Promise<void> {
  return apiClient.post<void>(API_ENDPOINTS.auth.logout, undefined, { signal });
}
