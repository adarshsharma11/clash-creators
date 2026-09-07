"use client";

import { motion } from "motion/react";
import type { Supporter } from "@/types/supporter";
import { Avatar } from "@/components/ui/avatar";
import { formatPoints } from "@/lib/formatters";
import { Users } from "lucide-react";

interface SupportersPreviewProps {
  supporters: Supporter[];
}

export function SupportersPreview({ supporters }: SupportersPreviewProps) {
  return (
    <section className="py-12 border-t border-border/40" id="supporters">
      <div className="mb-6 flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-2xl font-bold tracking-tight">Top Supporters</h3>
      </div>

      {supporters.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 px-6 py-12 text-center text-sm text-muted-foreground">
          No supporters yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supporters.map((supporter, index) => {
            const rank = index + 1;
            const isTopThree = rank <= 3;

            return (
              <motion.div
                key={supporter.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-border transition-colors group"
              >
                <div className="relative">
                  <Avatar
                    src={supporter.avatarUrl ?? undefined}
                    fallback={supporter.displayName}
                    className="h-12 w-12 transition-transform group-hover:scale-105"
                  />
                  {isTopThree ? (
                    <div
                      className={`absolute -bottom-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full text-[10px] font-bold border-2 border-background ${
                        rank === 1
                          ? "bg-amber-400 text-amber-950"
                          : rank === 2
                            ? "bg-slate-300 text-slate-900"
                            : "bg-amber-700 text-amber-50"
                      }`}
                    >
                      {rank}
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-bold truncate text-sm">@{supporter.username}</span>
                  <span className="text-xs text-primary font-mono font-bold">
                    {formatPoints(supporter.supportAmount)} Support
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
