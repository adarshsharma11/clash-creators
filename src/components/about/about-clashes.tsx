import Link from "next/link";
import type { Battle } from "@/types/battle";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { BattleStatusIndicator } from "@/components/clash/battle-status-indicator";
import { formatPoints } from "@/lib/formatters";
import { FadeIn } from "./fade-in";

interface AboutClashesProps {
  battle: Battle;
}

export function AboutClashes({ battle }: AboutClashesProps) {
  const preview = battle.entries.slice(0, 4);

  return (
    <section className="border-b border-border/40 py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-8">
        <FadeIn className="mb-10 max-w-2xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Every Clash tells a story.
          </h2>
          <p className="text-lg text-muted-foreground">
            Rankings can change while a Clash is active.
          </p>
        </FadeIn>

        <FadeIn>
          <article className="rounded-3xl border border-border/50 bg-card/40 p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold">{battle.title}</h3>
                <p className="text-sm text-muted-foreground">{battle.summary}</p>
              </div>
              <BattleStatusIndicator status={battle.status} />
            </div>

            <ol className="divide-y divide-border/40">
              {preview.map((entry, index) => (
                <li key={entry.creator.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <span className="w-8 font-mono text-sm font-bold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Avatar
                    src={entry.creator.avatarUrl}
                    alt={entry.creator.displayName}
                    className="h-9 w-9"
                  />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    @{entry.creator.username}
                  </span>
                  <span className="font-mono font-bold text-primary">
                    {formatPoints(entry.supportPoints)}
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-6">
              <Button asChild variant="outline" className="font-bold">
                <Link href={`/clash/${battle.id}`}>View Clash →</Link>
              </Button>
            </div>
          </article>
        </FadeIn>
      </div>
    </section>
  );
}
