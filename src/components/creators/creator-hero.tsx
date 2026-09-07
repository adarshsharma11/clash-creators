"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import type { Creator, CreatorSocialAccount } from "@/types/creator";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "@/components/ui/share-button";
import { CreatorSocialLinks } from "@/components/creators/creator-social-links";
import { formatNumber, formatPoints } from "@/lib/formatters";

interface CreatorHeroProps {
  creator: Creator;
  totalWins: number;
  socialAccounts?: CreatorSocialAccount[];
  rank?: number | null;
  supportPoints?: number;
  clashTitle?: string | null;
}

export function CreatorHero({
  creator,
  totalWins,
  socialAccounts = [],
  rank = null,
  supportPoints,
  clashTitle,
}: CreatorHeroProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden border-b border-border/40 pb-20 pt-12">
      <div className="container relative z-10 mx-auto px-4 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div
            initial={reduceMotion ? false : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="mb-6"
          >
            <Avatar
              src={creator.avatarUrl}
              alt={creator.displayName}
              fallback={creator.displayName}
              className="h-32 w-32 border-4 border-background shadow-xl ring-2 ring-primary/20 md:h-40 md:w-40"
            />
          </motion.div>

          <div className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
            @{creator.username}
          </div>

          <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {creator.displayName}
            {creator.verified ? (
              <Badge
                variant="secondary"
                className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 p-0 text-sm text-white"
              >
                <span className="sr-only">Verified</span>✓
              </Badge>
            ) : null}
          </h1>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
            {creator.category ? (
              <Badge variant="outline" className="py-1 text-sm font-medium">
                {creator.category} Creator
              </Badge>
            ) : null}
            {typeof creator.followers === "number" ? (
              <span className="font-medium">{formatNumber(creator.followers)} fans</span>
            ) : null}
          </div>

          {rank || supportPoints !== undefined || clashTitle ? (
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-border/50 bg-card/40 px-5 py-3 text-sm">
              {rank ? <span className="font-black text-primary">#{rank}</span> : null}
              {supportPoints !== undefined ? (
                <span className="font-mono font-bold tabular-nums">{formatPoints(supportPoints)} pts</span>
              ) : null}
              {clashTitle ? <span className="text-muted-foreground">{clashTitle}</span> : null}
            </div>
          ) : null}

          {totalWins > 0 ? (
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-500">
              {totalWins}x Clash Champion
            </div>
          ) : null}

          {socialAccounts.length > 0 ? (
            <div className="mb-8">
              <CreatorSocialLinks accounts={socialAccounts} />
            </div>
          ) : null}

          <div className="hidden flex-col items-center justify-center gap-4 sm:flex-row md:flex">
            <Button asChild size="lg" className="h-12 bg-primary px-8 text-base font-bold text-primary-foreground">
              <Link href={`/support/${creator.username}`}>Support Creator</Link>
            </Button>
            <ShareButton
              title={`Support ${creator.displayName} on ClashCreators`}
              text={`Check out ${creator.displayName}'s competitive profile!`}
              size="lg"
              className="h-12"
            />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/50 bg-background/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
        <Button asChild className="h-12 w-full bg-primary font-bold text-primary-foreground">
          <Link href={`/support/${creator.username}`}>Support Creator</Link>
        </Button>
      </div>
    </div>
  );
}
