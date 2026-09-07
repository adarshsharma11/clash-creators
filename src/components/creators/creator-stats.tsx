"use client";

import { motion } from "motion/react";
import { formatNumber, formatPoints } from "@/lib/formatters";

export type CreatorProfileStats = {
  wins: number;
  supportPoints: number;
  supportCount: number;
  clashes: number;
};

interface CreatorStatsProps {
  stats: CreatorProfileStats;
}

export function CreatorStats({ stats }: CreatorStatsProps) {
  const statItems = [
    { label: "Wins", value: stats.wins, highlight: true },
    { label: "Support", value: formatPoints(stats.supportPoints) },
    { label: "Supports", value: formatNumber(stats.supportCount) },
    { label: "Clashes", value: stats.clashes },
  ];

  return (
    <section className="py-12 border-b border-border/40">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${
              stat.highlight ? "bg-primary/5 border-primary/20" : "bg-card border-border/50"
            }`}
          >
            <div
              className={`text-3xl md:text-4xl font-black font-mono tracking-tighter mb-2 ${
                stat.highlight ? "text-primary" : "text-foreground"
              }`}
            >
              {stat.value}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
