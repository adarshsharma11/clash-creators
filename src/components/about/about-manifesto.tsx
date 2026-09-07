import type { BattleEntry } from "@/types/battle";
import { formatPoints } from "@/lib/formatters";
import { FadeIn } from "./fade-in";

interface AboutManifestoProps {
  entries: BattleEntry[];
}

export function AboutManifesto({ entries }: AboutManifestoProps) {
  const rows = entries.slice(0, 6);

  return (
    <section className="relative overflow-hidden border-b border-border/40 py-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.12]" aria-hidden="true">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-8 pt-10">
          {rows.map((entry) => (
            <div
              key={entry.creator.id}
              className="flex items-center justify-between rounded-xl border border-primary/20 px-4 py-3 font-mono text-sm"
            >
              <span>#{entry.rank} @{entry.creator.username}</span>
              <span className="text-primary">{formatPoints(entry.supportPoints)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container relative mx-auto max-w-3xl px-4 text-center sm:px-8">
        <FadeIn>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl">
            Discover. Support. Compete.
          </h2>
          <p className="text-lg text-muted-foreground">
            ClashCreators is designed around a simple idea: make creator competition easy
            to discover, easy to understand, and impossible to ignore.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}
