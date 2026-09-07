"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { JoinClashModal } from "@/components/clash/join-clash-modal";
import { TodayClashCard } from "@/components/home/today-clash-card";
import { CURRENT_BATTLE_ID } from "@/data/constants";
import { useAvailableClashes, useClashLeaderboard } from "@/hooks/queries/use-clashes";
import { clashPageHref, getReasonablyJoinableClashes } from "@/lib/join-clash-flow";

function featuredClashHref(slug?: string) {
  return slug ? `/clash/${slug}` : `/clash/${CURRENT_BATTLE_ID}`;
}

export function HeroSection() {
  const reduceMotion = useReducedMotion();
  const clashOptions = useAvailableClashes();
  const featured = clashOptions.liveClash ?? clashOptions.clashes[0] ?? null;
  const joinable = getReasonablyJoinableClashes(clashOptions.clashes);
  const canJoin = joinable.length > 0;
  const featuredId = featured?.slug ?? featured?.id ?? "";
  const leaderboardQuery = useClashLeaderboard(featuredId, { limit: 50 }, Boolean(featuredId));
  const supportPoints = (leaderboardQuery.data?.items ?? []).reduce((sum, item) => sum + item.points, 0);
  const clashHref = featured ? clashPageHref(featured) : featuredClashHref();
  const [joinOpen, setJoinOpen] = useState(false);

  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === "#join-clash" && canJoin) {
        setJoinOpen(true);
      }
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [canJoin]);

  const openJoin = () => {
    if (!canJoin) {
      return;
    }
    setJoinOpen(true);
    if (window.location.hash !== "#join-clash") {
      window.history.replaceState(null, "", "#join-clash");
    }
  };

  const closeJoin = () => {
    setJoinOpen(false);
    if (window.location.hash === "#join-clash") {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  };

  const eyebrow = featured?.status === "UPCOMING" ? "Up next" : "Live today";

  return (
    <section className="relative overflow-hidden pt-14 pb-16 md:pt-20 md:pb-20">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/16 via-background to-background" />
      <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />

      <div className="container relative z-10 mx-auto grid items-center gap-10 px-4 sm:px-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,22rem)] lg:gap-14">
        <div className="max-w-2xl">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-amber-400"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
            {eyebrow}
          </motion.p>

          <motion.h1
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.06 }}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Creators compete.
            <br />
            You decide who wins.
          </motion.h1>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.12 }}
            className="mt-5 max-w-md text-base text-muted-foreground sm:text-lg"
          >
            Support your favorite creator, or enter today&apos;s clash.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: reduceMotion ? 0 : 0.18 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {clashOptions.isPending ? (
              <Button
                id="join-clash"
                size="lg"
                disabled
                className="h-12 bg-primary px-7 font-bold text-primary-foreground"
              >
                Join Today&apos;s Clash
              </Button>
            ) : canJoin ? (
              <Button
                id="join-clash"
                size="lg"
                className="h-12 bg-primary px-7 font-bold text-primary-foreground shadow-[0_0_24px_rgba(245,158,11,0.22)]"
                onClick={openJoin}
              >
                Join Today&apos;s Clash
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">No clash is open right now.</p>
            )}
            <Button size="lg" variant="outline" className="h-12 px-7 font-semibold" asChild>
              <Link href={clashHref}>Watch Live Clash</Link>
            </Button>
          </motion.div>
        </div>

        <TodayClashCard
          clash={featured}
          clashHref={clashHref}
          supportPoints={supportPoints}
          isLoading={clashOptions.isPending}
          isError={clashOptions.isError}
          isRetrying={clashOptions.isFetching}
          onRetry={() => void clashOptions.refetch()}
        />
      </div>

      <JoinClashModal
        open={joinOpen}
        onClose={closeJoin}
        clashId={joinable[0]?.id}
      />
    </section>
  );
}
