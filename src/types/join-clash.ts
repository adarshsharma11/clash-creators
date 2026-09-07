export const JOIN_CLASH_STEPS = [1, 2, 3, 4] as const;

export type JoinClashStep = (typeof JOIN_CLASH_STEPS)[number];

export type JoinClashDraft = {
  displayName: string;
  username: string;
  bio: string;
  avatarPreviewUrl: string | null;
  categoryId: string | null;
};

export type JoinClashFieldErrors = {
  displayName?: string;
  username?: string;
  bio?: string;
  categoryId?: string;
};

export const EMPTY_JOIN_CLASH_DRAFT: JoinClashDraft = {
  displayName: "",
  username: "",
  bio: "",
  avatarPreviewUrl: null,
  categoryId: null,
};
