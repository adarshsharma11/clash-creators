"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface SupportPanelProps {
  creatorName: string;
  creatorUsername: string;
  currentRank: number;
  distanceToNext: number;
  onSupport: (amount: number) => void;
}

export function SupportPanel({ 
  creatorName, 
  creatorUsername, 
  currentRank, 
  distanceToNext,
  onSupport
}: SupportPanelProps) {
  const [isSupporting, setIsSupporting] = useState<number | null>(null);
  
  const handleSupport = (amount: number) => {
    setIsSupporting(amount);
    onSupport(amount);
    setTimeout(() => setIsSupporting(null), 1000);
  };

  const supportOptions = [10, 50, 250, 1000];

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 sm:p-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-5 w-5 text-primary fill-primary" />
          <h3 className="text-xl font-bold uppercase tracking-wide">Support @{creatorUsername}</h3>
        </div>
        
        <p className="text-muted-foreground mb-6">
          Help {creatorName} climb the leaderboard.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="bg-background rounded-xl p-4 border border-border flex-1">
            <div className="text-sm text-muted-foreground font-semibold uppercase mb-1">Current Position</div>
            <div className="text-3xl font-black text-foreground">#{currentRank}</div>
          </div>
          
          <div className="bg-background rounded-xl p-4 border border-border flex-1">
            <div className="text-sm text-muted-foreground font-semibold uppercase mb-1">Status</div>
            {currentRank === 1 ? (
              <div className="text-xl font-bold text-amber-500 flex items-center gap-2">
                👑 You&apos;re currently #1
              </div>
            ) : (
              <div className="text-xl font-bold flex items-center gap-2">
                <span className="text-primary">{distanceToNext.toLocaleString()}</span> to #{currentRank - 1}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Support Packs</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {supportOptions.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className={`h-14 font-bold text-lg relative overflow-hidden transition-all duration-300 ${
                  isSupporting === amount ? 'bg-green-500 text-white border-green-500' : 'hover:border-primary hover:text-primary'
                }`}
                onClick={() => handleSupport(amount)}
                disabled={isSupporting !== null}
              >
                <AnimatePresence mode="wait">
                  {isSupporting === amount ? (
                    <motion.div
                      key="success"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="flex items-center gap-1"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="amount"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                    >
                      +{amount}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
