"use client";

import { motion } from "motion/react";
import type { Achievement } from "@/types/achievements";
import { Award } from "lucide-react";
import { AchievementIcon } from "@/components/ui/achievement-icon";

interface AchievementsGridProps {
  achievements: Achievement[];
}

export function AchievementsGrid({ achievements }: AchievementsGridProps) {
  return (
    <section className="py-12" id="achievements">
      <div className="flex items-center gap-2 mb-6">
        <Award className="h-5 w-5 text-primary" />
        <h3 className="text-2xl font-bold tracking-tight">Achievements</h3>
      </div>

      {achievements.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border/60 px-6 py-12 text-center text-sm text-muted-foreground">
          No achievements yet. Wins and clash milestones will appear here.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => {
            const unlocked = achievement.isUnlocked;

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-300 ${
                  unlocked
                    ? "bg-card border-border/50 hover:bg-card/80 hover:border-primary/50"
                    : "bg-muted/30 border-transparent opacity-60 grayscale"
                }`}
              >
                <div
                  className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
                    unlocked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <AchievementIcon
                    icon={achievement.icon}
                    slug={achievement.slug}
                    title={achievement.title}
                    unlocked={unlocked}
                  />
                </div>
                <h4 className={`font-bold mb-2 ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                  {achievement.title}
                </h4>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
