"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useUpdateMyCreatorProfile } from "@/hooks/mutations/use-creator-profile";
import { useCategories } from "@/hooks/queries/use-categories";
import { resolveCreatorUsername } from "@/lib/clash-view";
import { updateCreatorProfileSchema } from "@/lib/validations/creator";
import { getApiErrorMessage } from "@/types/api";
import type { CreatorDetail } from "@/types/creator";

interface CreatorProfileEditorProps {
  creator: CreatorDetail;
}

export function CreatorProfileEditor({ creator }: CreatorProfileEditorProps) {
  const categoriesQuery = useCategories();
  const updateProfile = useUpdateMyCreatorProfile(resolveCreatorUsername(creator));
  const [displayName, setDisplayName] = useState(creator.displayName);
  const [bio, setBio] = useState(creator.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(creator.avatarUrl ?? "");
  const [categoryId, setCategoryId] = useState(creator.category?.id ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (updateProfile.isPending) {
      return;
    }

    const parsed = updateCreatorProfileSchema.safeParse({ displayName, bio, avatarUrl, categoryId });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setError(null);
    updateProfile.mutate(parsed.data, {
      onSuccess: () => setFeedback("Profile updated."),
      onError: (mutationError) => setError(getApiErrorMessage(mutationError)),
    });
  };

  const inputClass =
    "mt-1.5 h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <section className="mt-10 rounded-3xl border border-border/50 bg-card/30 p-5 sm:p-8">
      <h2 className="mb-4 text-lg font-bold tracking-tight">Edit profile</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="creator-display-name" className="text-sm font-semibold">
            Display name
          </label>
          <input id="creator-display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} className={inputClass} />
          {fieldErrors.displayName ? <p className="mt-1 text-xs text-red-400">{fieldErrors.displayName}</p> : null}
        </div>
        <div>
          <label htmlFor="creator-bio" className="text-sm font-semibold">
            Bio
          </label>
          <textarea
            id="creator-bio"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            className={`${inputClass} min-h-24 py-3`}
          />
          {fieldErrors.bio ? <p className="mt-1 text-xs text-red-400">{fieldErrors.bio}</p> : null}
        </div>
        <div>
          <label htmlFor="creator-avatar" className="text-sm font-semibold">
            Avatar URL
          </label>
          <input id="creator-avatar" value={avatarUrl} onChange={(event) => setAvatarUrl(event.target.value)} className={inputClass} />
          {fieldErrors.avatarUrl ? <p className="mt-1 text-xs text-red-400">{fieldErrors.avatarUrl}</p> : null}
        </div>
        <div>
          <label htmlFor="creator-category" className="text-sm font-semibold">
            Category
          </label>
          <select
            id="creator-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className={inputClass}
          >
            <option value="">No category</option>
            {(categoriesQuery.data ?? []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        {feedback ? <p className="text-sm text-primary">{feedback}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? "Saving…" : "Save profile"}
        </Button>
      </form>
    </section>
  );
}
