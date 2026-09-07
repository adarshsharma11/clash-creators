import type { Metadata } from "next";
import { AboutClashes } from "@/components/about/about-clashes";
import { AboutCreators } from "@/components/about/about-creators";
import { AboutCta } from "@/components/about/about-cta";
import { AboutHero } from "@/components/about/about-hero";
import { AboutHowItWorks } from "@/components/about/about-how-it-works";
import { AboutIntro } from "@/components/about/about-intro";
import { AboutManifesto } from "@/components/about/about-manifesto";
import { AboutSocial } from "@/components/about/about-social";
import { AboutSupporters } from "@/components/about/about-supporters";
import { AboutWhy } from "@/components/about/about-why";
import { AboutWinners } from "@/components/about/about-winners";
import { currentBattle } from "@/data/battles";
import { CURRENT_BATTLE_ID } from "@/data/constants";
import { calculateRankAfterSupport } from "@/lib/ranking";

export const metadata: Metadata = {
  title: "About — ClashCreators",
  description:
    "Discover ClashCreators, a platform built around creator competition, Clashes, support, and public leaderboards.",
};

const EXAMPLE_SUPPORT = 500;

export default function AboutPage() {
  const clashHref = `/clash/${CURRENT_BATTLE_ID}`;
  const featuredEntry = currentBattle.entries[1] ?? currentBattle.entries[0];
  const supportPreview = featuredEntry
    ? calculateRankAfterSupport(currentBattle.entries, featuredEntry.creator.id, EXAMPLE_SUPPORT)
    : null;

  return (
    <main className="flex flex-1 flex-col">
      <AboutHero
        clashHref={clashHref}
        clashTitle={currentBattle.title}
        clashStatus={currentBattle.status}
        topEntries={currentBattle.entries.slice(0, 3)}
      />
      <AboutIntro />
      <AboutHowItWorks />
      <AboutWhy />
      {featuredEntry ? (
        <AboutCreators entry={featuredEntry} clashStatus={currentBattle.status} />
      ) : null}
      {featuredEntry && supportPreview ? (
        <AboutSupporters
          entry={featuredEntry}
          preview={supportPreview}
          exampleAmount={EXAMPLE_SUPPORT}
        />
      ) : null}
      <AboutClashes battle={currentBattle} />
      <AboutWinners />
      <AboutManifesto entries={currentBattle.entries} />
      <AboutCta />
      <AboutSocial />
    </main>
  );
}
