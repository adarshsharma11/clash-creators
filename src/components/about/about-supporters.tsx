import Link from "next/link";
import type { BattleEntry } from "@/types/battle";
import type { SupportRankPreview } from "@/types/support";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatPoints } from "@/lib/formatters";
import { FadeIn } from "./fade-in";

interface AboutSupportersProps {
  entry: BattleEntry;
  preview: SupportRankPreview;
  exampleAmount: number;
}

export function AboutSupporters({ entry, preview, exampleAmount }: AboutSupportersProps) {
  return (
    <section className="border-b border-border/40 py-20">
      <div className="container mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-2">
        <FadeIn className="lg:order-2">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            For the people behind the creators
          </h2>
          <p className="mb-6 text-lg text-muted-foreground">
            Supporters are part of the competition. Find a creator, choose your support,
            and watch their position change.
          </p>
          <p className="mb-8 text-sm text-muted-foreground">
            This is a preview of the support flow. Confirming support happens on the
            creator&apos;s support page.
          </p>
          <Button asChild size="lg" className="h-12 font-bold">
            <Link href={`/support/${entry.creator.username}`}>Support a Creator →</Link>
          </Button>
        </FadeIn>

        <FadeIn delay={0.08} className="lg:order-1">
          <article
            className="rounded-3xl border border-border/50 bg-card/50 p-6 sm:p-8"
            aria-label="Example support preview"
          >
            <div className="mb-6 flex items-center gap-3">
              <Avatar
                src={entry.creator.avatarUrl}
                alt={entry.creator.displayName}
                className="h-12 w-12"
              />
              <div>
                <div className="font-bold">@{entry.creator.username}</div>
                <div className="text-xs text-muted-foreground">Example preview</div>
              </div>
            </div>
            <dl className="space-y-3 text-sm">
              <Row label="Current" value={`#${preview.currentRank}`} />
              <Row label="Support" value={formatPoints(preview.currentSupport)} />
              <Row
                label="Your Support"
                value={`+${formatPoints(exampleAmount)}`}
                accent
              />
              <Row label="Possible Position" value={`#${preview.afterRank}`} />
            </dl>
          </article>
        </FadeIn>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "font-mono font-bold text-primary" : "font-semibold"}>{value}</dd>
    </div>
  );
}
