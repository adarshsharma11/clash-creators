import { Avatar } from "@/components/ui/avatar";
import type { ClashListItem } from "@/types/clash";
import type { Category } from "@/types/category";
import type { JoinClashDraft } from "@/types/join-clash";
import { formatDateTime } from "@/lib/formatters";
import { normalizeJoinUsername } from "@/lib/join-clash";

interface ReviewStepProps {
  draft: JoinClashDraft;
  category: Category | null;
  clash: ClashListItem | null;
}

export function ReviewStep({ draft, category, clash }: ReviewStepProps) {
  const username = normalizeJoinUsername(draft.username);
  const displayName = draft.displayName.trim();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Everything looks good?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your entry, then join the upcoming clash.
        </p>
      </div>

      <dl className="space-y-4 rounded-3xl border border-border/50 bg-card/40 p-6">
        <div className="flex items-center gap-4">
          <Avatar
            src={draft.avatarPreviewUrl ?? undefined}
            alt=""
            fallback={displayName}
            className="h-14 w-14"
          />
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Creator
            </dt>
            <dd className="font-bold">{displayName}</dd>
          </div>
        </div>

        <ReviewRow label="Username" value={`@${username}`} />
        <ReviewRow label="Category" value={category?.name ?? "—"} />
        <ReviewRow label="Clash" value={clash?.title ?? "No upcoming clash in this category"} />
        <ReviewRow label="Starts" value={clash ? formatDateTime(clash.startsAt) : "—"} />
        <ReviewRow label="Ends" value={clash ? formatDateTime(clash.endsAt) : "—"} />
        <ReviewRow label="After joining" value="You'll appear on the clash board. Support opens when it goes live." />
        <ReviewRow
          label="Profile information"
          value={draft.bio.trim() || "No bio added."}
        />
      </dl>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border/40 pt-4">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm leading-relaxed">{value}</dd>
    </div>
  );
}
