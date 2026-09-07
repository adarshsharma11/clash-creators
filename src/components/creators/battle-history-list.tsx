"use client";

import { motion } from "motion/react";
import type { BattleHistory } from "@/types/battle-history";
import { formatPoints } from "@/lib/formatters";
import { History, Trophy } from "lucide-react";

interface BattleHistoryListProps {
  history: BattleHistory[];
}

export function BattleHistoryList({ history }: BattleHistoryListProps) {
  return (
    <section className="py-12" id="history">
      <div className="flex items-center gap-2 mb-6">
        <History className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-2xl font-bold tracking-tight">Battle History</h3>
      </div>

      {history.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 px-6 py-12 text-center text-sm text-muted-foreground">
          No clashes yet.
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((battle, index) => {
            const isWinner = battle.rank === 1;
            const isPodium = battle.rank !== null && battle.rank <= 3;

            return (
              <motion.div
                key={battle.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`flex items-center justify-between p-5 rounded-2xl border transition-colors ${
                  isWinner
                    ? "bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60"
                    : "bg-card border-border/50 hover:border-border"
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-muted-foreground">{battle.date}</span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-mono text-2xl font-black ${
                        isWinner
                          ? "text-amber-500"
                          : battle.rank === 2
                            ? "text-slate-300"
                            : battle.rank === 3
                              ? "text-amber-700"
                              : "text-foreground"
                      }`}
                    >
                      {battle.rank ? `#${battle.rank}` : "—"}
                    </span>
                    {battle.title ? (
                      <span className="text-sm font-semibold text-muted-foreground">{battle.title}</span>
                    ) : null}
                    {isWinner ? (
                      <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                        <Trophy className="h-3 w-3" /> Champion
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Support
                  </span>
                  <span
                    className={`font-mono text-xl font-bold tracking-tighter ${
                      isPodium ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {formatPoints(battle.supportPoints)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
