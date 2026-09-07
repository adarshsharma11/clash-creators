"use client";

import { JoinField, JoinInput, JoinTextarea } from "./join-field";
import { Avatar } from "@/components/ui/avatar";
import { JOIN_CLASH_BIO_MAX } from "@/lib/join-clash";
import type { JoinClashDraft, JoinClashFieldErrors } from "@/types/join-clash";

interface CreatorInfoStepProps {
  draft: JoinClashDraft;
  errors: JoinClashFieldErrors;
  locked?: boolean;
  onChange: (patch: Partial<JoinClashDraft>) => void;
  onAvatarChange: (file: File | null) => void;
}

export function CreatorInfoStep({
  draft,
  errors,
  locked = false,
  onChange,
  onAvatarChange,
}: CreatorInfoStepProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Creator information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This is the creator profile that will join the clash.
        </p>
      </div>

      <JoinField id="display-name" label="Display name" error={errors.displayName}>
        <JoinInput
          id="display-name"
          name="displayName"
          autoComplete="name"
          placeholder="Nova Plays"
          value={draft.displayName}
          readOnly={locked}
          error={Boolean(errors.displayName)}
          aria-invalid={Boolean(errors.displayName)}
          aria-describedby={errors.displayName ? "display-name-error" : undefined}
          onChange={(event) => onChange({ displayName: event.target.value })}
        />
      </JoinField>

      <JoinField
        id="username"
        label="Username"
        hint="Letters, numbers, and underscores. 3–20 characters."
        error={errors.username}
      >
        <JoinInput
          id="username"
          name="username"
          autoComplete="username"
          placeholder="novaplays"
          value={draft.username}
          readOnly={locked}
          error={Boolean(errors.username)}
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? "username-error" : "username-hint"}
          onChange={(event) => onChange({ username: event.target.value })}
        />
      </JoinField>

      <JoinField id="avatar" label="Profile image" optional>
        <div className="flex items-center gap-4">
          <Avatar
            src={draft.avatarPreviewUrl ?? undefined}
            alt=""
            fallback={draft.displayName || draft.username || "C"}
            className="h-16 w-16"
          />
          <input
            id="avatar"
            type="file"
            accept="image/*"
            disabled={locked}
            className="min-w-0 flex-1 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium file:text-foreground"
            onChange={(event) => onAvatarChange(event.target.files?.[0] ?? null)}
          />
        </div>
      </JoinField>

      <JoinField
        id="bio"
        label="Short bio"
        optional
        hint={`${draft.bio.length}/${JOIN_CLASH_BIO_MAX}`}
        error={errors.bio}
      >
        <JoinTextarea
          id="bio"
          name="bio"
          maxLength={JOIN_CLASH_BIO_MAX}
          placeholder="What should fans know about you?"
          value={draft.bio}
          readOnly={locked}
          error={Boolean(errors.bio)}
          aria-invalid={Boolean(errors.bio)}
          aria-describedby={errors.bio ? "bio-error" : "bio-hint"}
          onChange={(event) => onChange({ bio: event.target.value })}
        />
      </JoinField>
    </div>
  );
}
