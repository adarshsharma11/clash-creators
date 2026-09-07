import type { Metadata } from "next";
import Link from "next/link";
import { RulesAccordion } from "@/components/rules/rules-accordion";
import { currentBattle } from "@/data/battles";
import { ruleSections } from "@/data/rules";

export const metadata: Metadata = {
  title: "Rules — ClashCreators",
  description: "How ClashCreators battles, rankings, and Support Points work.",
};

export default function RulesPage() {
  const rankingExample = currentBattle.entries.slice(0, 3).map((entry) => ({
    rank: entry.rank,
    username: entry.creator.username,
    supportPoints: entry.supportPoints,
  }));

  return (
    <main className="flex flex-1 flex-col">
      <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-primary">
            Rules
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            How ClashCreators works
          </h1>
          <p className="text-lg text-muted-foreground">
            Support Points, live rankings, and the daily crown — in one place.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Looking for short answers?{" "}
            <Link href="/faq" className="font-semibold text-primary hover:text-primary/80">
              Read the FAQ
            </Link>
            .
          </p>
        </header>

        <RulesAccordion sections={ruleSections} rankingExample={rankingExample} />
      </div>
    </main>
  );
}
