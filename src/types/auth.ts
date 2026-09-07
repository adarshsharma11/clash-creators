import type { CreatorCategoryRef, CreatorSocialAccount, CreatorStatus } from "@/types/creator";

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  role?: string;
  isActive?: boolean;
};

export type AuthCreatorProfile = {
  id: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  status: CreatorStatus;
  category: CreatorCategoryRef | null;
};

export type AuthSession = {
  user: AuthUser;
  creatorProfile: AuthCreatorProfile | null;
  socialAccounts: CreatorSocialAccount[];
};

export type AuthLoginInput = {
  username: string;
  password: string;
};

export type AuthSignupInput = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export type AdminSession = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive?: boolean;
};

export type AdminLoginInput = {
  email: string;
  password: string;
};
