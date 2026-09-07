"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { BattleEntry } from "@/types/battle";
import { Avatar } from "@/components/ui/avatar";
import { formatPoints } from "@/lib/formatters";

interface TopThreeProps {
  entries: BattleEntry[];
}

export function TopThree({ entries }: TopThreeProps) {
  const top3 = entries.slice(0, 3);
  
  if (top3.length < 3) return null;
  
  // Reorder for display: 2nd, 1st, 3rd
  const displayOrder = [top3[1], top3[0], top3[2]];

  return (
    <div className="relative pt-12 pb-16 flex justify-center items-end gap-2 sm:gap-6 md:gap-12">
      {displayOrder.map((entry) => {
        const isFirst = entry.rank === 1;
        const delay = isFirst ? 0 : entry.rank === 2 ? 0.1 : 0.2;
        
        return (
          <motion.div
            key={entry.creator.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className={`flex flex-col items-center ${isFirst ? 'z-10' : 'z-0'}`}
          >
            <Link href={`/creators/${entry.creator.username}`} className="group/link flex flex-col items-center">
              <div className="relative mb-4 group">
                <div className={`absolute -inset-1 rounded-full blur-md opacity-0 group-hover:opacity-50 transition duration-500 ${isFirst ? 'bg-amber-400 opacity-30' : entry.rank === 2 ? 'bg-slate-300' : 'bg-amber-700'}`}></div>
                <Avatar 
                  src={entry.creator.avatarUrl ?? undefined}
                  alt={entry.creator.displayName}
                  fallback={entry.creator.displayName}
                  className={`relative border-4 bg-background shadow-xl transition-transform duration-300 group-hover/link:scale-105 ${
                    isFirst 
                      ? 'h-24 w-24 sm:h-32 sm:w-32 border-amber-400' 
                      : entry.rank === 2
                        ? 'h-20 w-20 sm:h-24 sm:w-24 border-slate-300'
                        : 'h-16 w-16 sm:h-20 sm:w-20 border-amber-700'
                  }`}
                />
                <div className={`absolute -bottom-3 -right-3 flex items-center justify-center rounded-full border-2 border-background font-bold ${
                  isFirst 
                    ? 'h-8 w-8 bg-amber-400 text-amber-950 text-sm' 
                    : entry.rank === 2
                      ? 'h-7 w-7 bg-slate-300 text-slate-900 text-xs'
                      : 'h-6 w-6 bg-amber-700 text-amber-50 text-xs'
                }`}>
                  #{entry.rank}
                </div>
                {isFirst && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl drop-shadow-md">
                    👑
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className={`font-bold truncate max-w-[100px] sm:max-w-[150px] group-hover/link:text-primary transition-colors ${isFirst ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}>
                  {entry.creator.displayName}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[100px] sm:max-w-[120px]">
                  @{entry.creator.username}
                </div>
                <div className={`mt-2 font-mono font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br ${
                  isFirst 
                    ? 'from-amber-400 to-amber-600 text-lg sm:text-xl' 
                    : entry.rank === 2
                      ? 'from-slate-300 to-slate-500 text-base sm:text-lg'
                      : 'from-amber-600 to-amber-800 text-sm sm:text-base'
                }`}>
                  {formatPoints(entry.supportPoints)}
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
