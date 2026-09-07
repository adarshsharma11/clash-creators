import type { CreatorSocialAccount } from "@/types/creator";
import { SocialPlatformIcon } from "@/components/ui/social-platform-icon";
import { getSocialPlatformMeta, isSocialPlatform } from "@/lib/social-platforms";

interface CreatorSocialLinksProps {
  accounts: CreatorSocialAccount[];
}

export function CreatorSocialLinks({ accounts }: CreatorSocialLinksProps) {
  const visible = accounts.filter((account) => isSocialPlatform(account.platform));

  if (visible.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap items-center justify-center gap-2">
      {visible.map((account) => {
        const meta = getSocialPlatformMeta(account.platform);
        const href = meta.formatUrl(account.username ?? "", account.profileUrl);
        const label = account.displayName || (account.username ? `@${account.username}` : meta.label);
        const content = (
          <>
            <SocialPlatformIcon platform={account.platform} className="h-4 w-4" />
            <span>{meta.label}</span>
            {account.isVerified ? <span aria-label="Verified">✓</span> : null}
          </>
        );

        return (
          <li key={`${account.platform}-${account.username ?? account.profileUrl ?? "account"}`}>
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {content}
              </a>
            ) : (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border/50 bg-muted/30 px-3 py-1.5 text-xs font-semibold text-muted-foreground/70"
                title="Account unavailable"
              >
                {content}
                <span className="sr-only">unavailable</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
