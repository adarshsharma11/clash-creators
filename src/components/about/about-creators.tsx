import Link from "next/link";
import type { BattleEntry } from "@/types/battle";
import type { BattleStatus } from "@/types/battle";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { BattleStatusIndicator } from "@/components/clash/battle-status-indicator";
import { formatPoints } from "@/lib/formatters";
import { FadeIn } from "./fade-in";

interface AboutCreatorsProps {
  entry: BattleEntry;
  clashStatus: BattleStatus;
}

export function AboutCreators({ entry, clashStatus }: AboutCreatorsProps) {
  return (
    <section className="border-b border-border/40 py-20">
      <div className="container mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-2">
        <FadeIn>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Built for creators
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            ClashCreators gives creators a place where competition is visible, progress
            is measurable, and supporters can rally behind them.
          </p>
          <Button asChild size="lg" className="h-12 font-bold">
            <Link href="/#creators">Explore Creators →</Link>
          </Button>
        </FadeIn>

        <FadeIn delay={0.08}>
          <article className="rounded-3xl border border-border/50 bg-card/50 p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-4">
              <Avatar
                src={entry.creator.avatarUrl}
                alt={entry.creator.displayName}
                className="h-16 w-16"
              />
              <div>
                <div className="font-bold">{entry.creator.displayName}</div>
                <div className="text-sm text-muted-foreground">@{entry.creator.username}</div>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-4">
              <div>
                <dt className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Current Rank
                </dt>
                <dd className="text-2xl font-black">#{entry.rank}</dd>
              </div>
              <div>
                <dt className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Support
                </dt>
                <dd className="font-mono text-2xl font-bold text-primary">
                  {formatPoints(entry.supportPoints)}
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Clash
                </dt>
                <dd>
                  <BattleStatusIndicator status={clashStatus} />
                </dd>
              </div>
            </dl>
          </article>
        </FadeIn>
      </div>
    </section>
  );
}
