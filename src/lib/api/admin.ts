import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toSearchParams } from "@/lib/api/config";
import { ApiError } from "@/types/api";
import type { Achievement, CreateAchievementInput, UpdateAchievementInput } from "@/types/achievement";
import type {
  AdminClashQuery,
  AdminCreator,
  AdminCreatorQuery,
  AdminDashboard,
  AdminPayment,
  AdminPaymentQuery,
  AdminReportQuery,
  AuditLogQuery,
  CreatorStatus,
  PaginatedResult,
} from "@/types/admin";
import type { AdminLoginInput, AdminSession } from "@/types/auth";
import type { AuditLog } from "@/types/audit-log";
import type { AdminClash, CompleteClashResult, CreateClashInput, UpdateClashInput } from "@/types/clash";
import type { AdminReport, UpdateReportInput } from "@/types/report";
import type { PlatformSetting, UpdateSettingInput } from "@/types/setting";

export function adminLogin(input: AdminLoginInput, signal?: AbortSignal): Promise<AdminSession> {
  return apiClient.post<AdminSession>(API_ENDPOINTS.admin.login, input, { signal });
}

export function adminLogout(signal?: AbortSignal): Promise<void> {
  return apiClient.post<void>(API_ENDPOINTS.admin.logout, undefined, { signal });
}

export async function getAdminSession(signal?: AbortSignal): Promise<AdminSession | null> {
  try {
    return await apiClient.get<AdminSession>(API_ENDPOINTS.admin.me, { signal });
  } catch (error) {
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return null;
    }

    throw error;
  }
}

export function getAdminDashboard(signal?: AbortSignal): Promise<AdminDashboard> {
  return apiClient.get<AdminDashboard>(API_ENDPOINTS.admin.dashboard, { signal });
}

export function getAdminCreators(
  query: AdminCreatorQuery = {},
  signal?: AbortSignal
): Promise<PaginatedResult<AdminCreator>> {
  return apiClient.getPaginated<AdminCreator>(
    `${API_ENDPOINTS.admin.creators}${toSearchParams(query)}`,
    { signal }
  );
}

export function updateCreatorStatus(
  id: string,
  status: CreatorStatus,
  signal?: AbortSignal
): Promise<{ id: string; displayName: string; status: CreatorStatus }> {
  return apiClient.patch(API_ENDPOINTS.admin.creatorStatus(id), { status }, { signal });
}

export function getAdminClashes(
  query: AdminClashQuery = {},
  signal?: AbortSignal
): Promise<PaginatedResult<AdminClash>> {
  return apiClient.getPaginated<AdminClash>(
    `${API_ENDPOINTS.admin.clashes}${toSearchParams(query)}`,
    { signal }
  );
}

export function createClash(input: CreateClashInput, signal?: AbortSignal): Promise<AdminClash> {
  return apiClient.post<AdminClash>(API_ENDPOINTS.admin.clashes, input, { signal });
}

export function updateClash(
  id: string,
  input: UpdateClashInput,
  signal?: AbortSignal
): Promise<AdminClash> {
  return apiClient.patch<AdminClash>(API_ENDPOINTS.admin.clash(id), input, { signal });
}

export function addClashParticipant(
  id: string,
  input: { username: string; platform: string },
  signal?: AbortSignal
): Promise<{ alreadyJoined: boolean }> {
  return apiClient.post(API_ENDPOINTS.admin.clashParticipants(id), input, { signal });
}

export function completeClash(id: string, signal?: AbortSignal): Promise<CompleteClashResult> {
  return apiClient.post<CompleteClashResult>(API_ENDPOINTS.admin.completeClash(id), undefined, {
    signal,
  });
}

export function getAdminReports(
  query: AdminReportQuery = {},
  signal?: AbortSignal
): Promise<PaginatedResult<AdminReport>> {
  return apiClient.getPaginated<AdminReport>(
    `${API_ENDPOINTS.admin.reports}${toSearchParams(query)}`,
    { signal }
  );
}

export function updateReport(
  id: string,
  input: UpdateReportInput,
  signal?: AbortSignal
): Promise<{ id: string; status: string; resolvedAt: string | null; reason: string }> {
  return apiClient.patch(API_ENDPOINTS.admin.report(id), input, { signal });
}

export function getAdminAchievements(signal?: AbortSignal): Promise<Achievement[]> {
  return apiClient.get<Achievement[]>(API_ENDPOINTS.admin.achievements, { signal });
}

export function createAchievement(
  input: CreateAchievementInput,
  signal?: AbortSignal
): Promise<Achievement> {
  return apiClient.post<Achievement>(API_ENDPOINTS.admin.achievements, input, { signal });
}

export function updateAchievement(
  id: string,
  input: UpdateAchievementInput,
  signal?: AbortSignal
): Promise<Achievement> {
  return apiClient.patch<Achievement>(API_ENDPOINTS.admin.achievement(id), input, { signal });
}

export function deleteAchievement(id: string, signal?: AbortSignal): Promise<{ id: string }> {
  return apiClient.delete<{ id: string }>(API_ENDPOINTS.admin.achievement(id), { signal });
}

export function getAdminSettings(signal?: AbortSignal): Promise<PlatformSetting[]> {
  return apiClient.get<PlatformSetting[]>(API_ENDPOINTS.admin.settings, { signal });
}

export function updateSetting(
  key: string,
  input: UpdateSettingInput,
  signal?: AbortSignal
): Promise<PlatformSetting> {
  return apiClient.patch<PlatformSetting>(API_ENDPOINTS.admin.setting(key), input, { signal });
}

export function getAdminAuditLogs(
  query: AuditLogQuery = {},
  signal?: AbortSignal
): Promise<PaginatedResult<AuditLog>> {
  return apiClient.getPaginated<AuditLog>(
    `${API_ENDPOINTS.admin.auditLogs}${toSearchParams(query)}`,
    { signal }
  );
}

export function getAdminPayments(
  query: AdminPaymentQuery = {},
  signal?: AbortSignal
): Promise<PaginatedResult<AdminPayment>> {
  return apiClient.getPaginated<AdminPayment>(
    `${API_ENDPOINTS.admin.payments}${toSearchParams(query)}`,
    { signal }
  );
}

export function getAdminPayment(id: string, signal?: AbortSignal): Promise<AdminPayment> {
  return apiClient.get<AdminPayment>(API_ENDPOINTS.admin.payment(id), { signal });
}
