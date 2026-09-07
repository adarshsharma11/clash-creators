"use client";

import { useState } from "react";
import type { BattleEntry } from "@/types/battle";
import { useAuth } from "@/context/auth-context";
import { LeaderboardRow } from "./leaderboard-row";
import { TopThree } from "./top-three";
import { Button } from "@/components/ui/button";

interface LeaderboardProps {
  initialEntries: BattleEntry[];
}

export function Leaderboard({ initialEntries }: LeaderboardProps) {
  const { user, creatorProfile } = useAuth();
  const [visibleCount, setVisibleCount] = useState(10);
  const entries = initialEntries;

  const maxPoints = entries.length === 0 ? 0 : Math.max(...entries.map((entry) => entry.supportPoints));
  const visibleEntries = entries.slice(0, visibleCount);
  const hasMore = visibleCount < entries.length;

  return (
    <section className="py-12" id="leaderboard">
      <TopThree entries={entries} />
      
      <div className="mt-8 space-y-4">
        {visibleEntries.map((entry, index) => {
          const nextEntry = index > 0 ? entries[index - 1] : undefined;
          return (
            <LeaderboardRow 
              key={entry.creator.id}
              entry={entry}
              nextEntry={nextEntry}
              maxPoints={maxPoints}
              index={index}
              highlighted={
                entry.creator.username === user?.username ||
                entry.creator.id === creatorProfile?.id
              }
            />
          );
        })}
      </div>
      
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => setVisibleCount(prev => Math.min(prev + 10, entries.length))}
            className="w-full sm:w-auto"
          >
            Load More Creators
          </Button>
        </div>
      )}
    </section>
  );
}
