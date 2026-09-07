"use client";

import Link from "next/link";
import type { Battle, BattleEntry } from "@/types/battle";
import { BattleStatusIndicator } from "@/components/clash/battle-status-indicator";
import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/use-countdown";
import { formatCountdown, formatPoints } from "@/lib/formatters";

interface SupportBattleStatusProps {
  battle: Battle | null;
  entry: BattleEntry | null;
}

export function SupportBattleStatus({ battle, entry }: SupportBattleStatusProps) {
  if (!battle || !entry) {
    return (
      <section className="rounded-3xl border border-border/40 bg-card/40 p-6">
        <h3 className="mb-2 text-lg font-bold">No active Clash</h3>
        <p className="text-sm text-muted-foreground">
          Check back when the next battle begins.
        </p>
      </section>
    );
  }

  return <ActiveBattleStatus battle={battle} entry={entry} />;
}

function ActiveBattleStatus({ battle, entry }: { battle: Battle; entry: BattleEntry }) {
  const time = useCountdown(battle.endsAt);

  return (
    <section className="rounded-3xl border border-border/40 bg-card/40 p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold tracking-tight">{battle.title}</h3>
        <BattleStatusIndicator status={battle.status} />
      </div>

      <dl className="mb-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Position
          </dt>
          <dd className="text-xl font-black">#{entry.rank}</dd>
        </div>
        <div>
          <dt className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Support
          </dt>
          <dd className="font-mono text-xl font-bold text-primary">
            {formatPoints(entry.supportPoints)}
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Time Remaining
          </dt>
          <dd className="font-mono text-xl font-bold">
            {time.isExpired ? "00:00:00" : formatCountdown(time)}
          </dd>
        </div>
      </dl>

      <Button asChild variant="outline" className="w-full font-bold">
        <Link href={`/clash/${battle.slug ?? battle.id}`}>View Clash</Link>
      </Button>
    </section>
  );
}
