import type { AdminRole } from "@/types/auth";

export function isSuperAdmin(role?: AdminRole | null): boolean {
  return role === "SUPER_ADMIN";
}

export function canManageSettings(role?: AdminRole | null): boolean {
  return isSuperAdmin(role);
}

export function canDeleteAchievements(role?: AdminRole | null): boolean {
  return isSuperAdmin(role);
}

export function canDeleteCategories(role?: AdminRole | null): boolean {
  return isSuperAdmin(role);
}