import type { JoinClashDraft, JoinClashFieldErrors, JoinClashStep } from "@/types/join-clash";

export const JOIN_CLASH_USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,20}$/;
export const JOIN_CLASH_BIO_MAX = 160;
export const JOIN_CLASH_NAME_MAX = 40;

export function normalizeJoinUsername(value: string): string {
  return value.trim().replace(/^@+/, "");
}

export function validateJoinUsername(value: string): string | undefined {
  const username = normalizeJoinUsername(value);

  if (!username) {
    return "Username is required.";
  }

  if (username.length < 3) {
    return "Username must be at least 3 characters.";
  }

  if (username.length > 20) {
    return "Username must be 20 characters or fewer.";
  }

  if (!JOIN_CLASH_USERNAME_PATTERN.test(username)) {
    return "Use only letters, numbers, and underscores.";
  }

  return undefined;
}

export function validateJoinClashStep(
  step: JoinClashStep,
  draft: JoinClashDraft,
  categoryIds: readonly string[] = []
): JoinClashFieldErrors {
  if (step === 1) {
    const displayName = draft.displayName.trim();
    const errors: JoinClashFieldErrors = {};

    if (!displayName) {
      errors.displayName = "Display name is required.";
    } else if (displayName.length < 2) {
      errors.displayName = "Display name must be at least 2 characters.";
    } else if (displayName.length > JOIN_CLASH_NAME_MAX) {
      errors.displayName = `Display name must be ${JOIN_CLASH_NAME_MAX} characters or fewer.`;
    }

    const usernameError = validateJoinUsername(draft.username);
    if (usernameError) {
      errors.username = usernameError;
    }

    if (draft.bio.length > JOIN_CLASH_BIO_MAX) {
      errors.bio = `Bio must be ${JOIN_CLASH_BIO_MAX} characters or fewer.`;
    }

    return errors;
  }

  if (step === 2) {
    if (!draft.categoryId || !categoryIds.includes(draft.categoryId)) {
      return { categoryId: "Please select a category." };
    }
  }

  return {};
}

export function hasJoinClashErrors(errors: JoinClashFieldErrors): boolean {
  return Object.values(errors).some(Boolean);
}
