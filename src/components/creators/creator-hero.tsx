"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Creator, CreatorSocialAccount } from "@/types/creator";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import { CreatorSocialLinks } from "@/components/creators/creator-social-links";
import { formatNumber } from "@/lib/formatters";

interface CreatorHeroProps {
  creator: Creator;
  totalWins: number;
  socialAccounts?: CreatorSocialAccount[];
}

export function CreatorHero({ creator, totalWins, socialAccounts = [] }: CreatorHeroProps) {
  return (
    <div className="relative pt-12 pb-20 overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-background to-background"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mb-6"
          >
            <Avatar 
              src={creator.avatarUrl ?? undefined}
              alt={creator.displayName}
              fallback={creator.displayName}
              className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl ring-2 ring-primary/20"
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-sm font-bold tracking-widest text-muted-foreground uppercase mb-2">
              @{creator.username}
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight flex items-center justify-center gap-3 mb-4">
              {creator.displayName}
              {creator.verified && (
                <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center rounded-full bg-blue-500 text-white text-sm">
                  ✓
                </Badge>
              )}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm md:text-base text-muted-foreground mb-6">
              {creator.category ? (
                <Badge variant="outline" className="text-sm py-1 font-medium">{creator.category} Creator</Badge>
              ) : null}
              {creator.country ? (
                <>
                  {creator.category ? <span>&bull;</span> : null}
                  <span className="font-medium">{creator.country}</span>
                </>
              ) : null}
              {typeof creator.followers === "number" ? (
                <>
                  {creator.category || creator.country ? <span>&bull;</span> : null}
                  <span className="font-medium">{formatNumber(creator.followers)} Fans</span>
                </>
              ) : null}
            </div>
            
            {totalWins > 0 && (
              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-2 rounded-full font-bold text-sm md:text-base mb-8">
                🏆 {totalWins}x Clash Champion
              </div>
            )}

            {socialAccounts.length > 0 ? (
              <div className="mb-8">
                <CreatorSocialLinks accounts={socialAccounts} />
              </div>
            ) : null}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-bold">
                <Link href={`/support/${creator.username}`}>Support Creator</Link>
              </Button>
              <ShareButton 
                title={`Support ${creator.displayName} on ClashCreators`} 
                text={`Check out ${creator.displayName}'s competitive profile!`}
                size="lg"
                className="w-full sm:w-auto h-14"
              />
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
