"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { CreatorSocialLinks } from "@/components/creators/creator-social-links";
import { useUpsertMySocialAccount } from "@/hooks/mutations/use-creator-profile";
import { SOCIAL_PLATFORMS, getSocialPlatformMeta } from "@/lib/social-platforms";
import { upsertCreatorSocialSchema } from "@/lib/validations/creator";
import { getApiErrorMessage } from "@/types/api";
import type { CreatorSocialAccount, SocialPlatform } from "@/types/creator";

interface CreatorSocialEditorProps {
  username: string;
  accounts: CreatorSocialAccount[];
}

export function CreatorSocialEditor({ username, accounts }: CreatorSocialEditorProps) {
  const upsertSocial = useUpsertMySocialAccount(username);
  const [platform, setPlatform] = useState<SocialPlatform>("INSTAGRAM");
  const [socialUsername, setSocialUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputClass =
    "mt-1.5 h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (upsertSocial.isPending) {
      return;
    }

    const parsed = upsertCreatorSocialSchema.safeParse({
      platform,
      username: socialUsername,
      displayName,
      profileUrl,
      isPrimary,
    });
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
    upsertSocial.mutate(parsed.data, {
      onSuccess: () => {
        setFeedback(`${getSocialPlatformMeta(parsed.data.platform).label} saved.`);
        setSocialUsername("");
        setDisplayName("");
        setProfileUrl("");
        setIsPrimary(false);
      },
      onError: (mutationError) => setError(getApiErrorMessage(mutationError)),
    });
  };

  return (
    <section className="mt-6 rounded-3xl border border-border/50 bg-card/30 p-5 sm:p-8">
      <h2 className="mb-2 text-lg font-bold tracking-tight">Social accounts</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        You can add more than one platform. Existing accounts are listed below.
      </p>
      <div className="mb-6">
        <CreatorSocialLinks accounts={accounts} />
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="social-platform" className="text-sm font-semibold">
            Platform
          </label>
          <select
            id="social-platform"
            value={platform}
            onChange={(event) => setPlatform(event.target.value as SocialPlatform)}
            className={inputClass}
          >
            {SOCIAL_PLATFORMS.map((item) => (
              <option key={item} value={item}>
                {getSocialPlatformMeta(item).label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="social-username" className="text-sm font-semibold">
            Username
          </label>
          <input id="social-username" value={socialUsername} onChange={(event) => setSocialUsername(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="social-display-name" className="text-sm font-semibold">
            Display name
          </label>
          <input id="social-display-name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="social-url" className="text-sm font-semibold">
            Profile URL
          </label>
          <input id="social-url" value={profileUrl} onChange={(event) => setProfileUrl(event.target.value)} className={inputClass} />
          {fieldErrors.profileUrl ? <p className="mt-1 text-xs text-red-400">{fieldErrors.profileUrl}</p> : null}
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isPrimary} onChange={(event) => setIsPrimary(event.target.checked)} />
          Primary account
        </label>
        {feedback ? <p className="text-sm text-primary">{feedback}</p> : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <Button type="submit" disabled={upsertSocial.isPending}>
          {upsertSocial.isPending ? "Saving…" : "Save social account"}
        </Button>
      </form>
    </section>
  );
}
