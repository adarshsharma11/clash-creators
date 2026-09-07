"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { Flame, Trophy } from "lucide-react";
import type { Category } from "@/types/category";
import type { CategoryListItem } from "@/lib/category-rankings";
import { Button } from "@/components/ui/button";
import { formatPoints } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "./category-icon";
import { CategoryRankRow } from "./category-rank-row";

type Scope = "today" | "all";

interface CategoryDetailExperienceProps {
  category: Category;
  todayLeaders: CategoryListItem[];
  allCreators: CategoryListItem[];
  clashHref: string;
}

export function CategoryDetailExperience({
  category,
  todayLeaders,
  allCreators,
  clashHref,
}: CategoryDetailExperienceProps) {
  const [scope, setScope] = useState<Scope>("today");
  const items = scope === "today" ? todayLeaders : allCreators;
  const leader = todayLeaders[0] ?? allCreators[0];
  const metric = "support" as const;

  return (
    <div className="space-y-10">
      <div
        role="group"
        aria-label="Ranking scope"
        className="mx-auto flex w-fit rounded-full border border-border/50 bg-card/40 p-1"
      >
        <ScopeButton
          active={scope === "today"}
          onClick={() => setScope("today")}
          icon={<Flame className="h-3.5 w-3.5" />}
        >
          Today
        </ScopeButton>
        <ScopeButton
          active={scope === "all"}
          onClick={() => setScope("all")}
          icon={<Trophy className="h-3.5 w-3.5" />}
        >
          All-time
        </ScopeButton>
      </div>

      <header className="text-center">
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CategoryIcon name={category.icon} className="h-7 w-7" />
        </div>
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {category.name}
        </h1>
        {leader && leader.supportPoints !== null ? (
          <p className="text-lg text-muted-foreground">
            @{leader.username} leads with{" "}
            <span className="font-semibold text-primary">
              {formatPoints(leader.supportPoints)} Support
            </span>
          </p>
        ) : (
          <p className="text-lg text-muted-foreground">
            No creators are competing in this category yet.
          </p>
        )}

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {leader ? (
            <Button asChild size="lg" className="h-12 px-6 font-bold">
              <Link href={`/support/${leader.username}`}>
                Support @{leader.username}
              </Link>
            </Button>
          ) : null}
          <Button asChild size="lg" variant="outline" className="h-12 px-6 font-bold">
            <Link href={clashHref}>View Clash</Link>
          </Button>
        </div>
      </header>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold tracking-tight">
            {scope === "today" ? "Today's Clash" : "All creators"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "creator" : "creators"}
          </p>
        </div>

        {items.length > 0 ? (
          <ol className="space-y-3">
            {items.map((item, index) => (
              <CategoryRankRow
                key={item.username}
                item={item}
                position={index + 1}
                metric={metric}
              />
            ))}
          </ol>
        ) : (
          <p className="rounded-2xl border border-dashed border-border/60 px-6 py-12 text-center text-sm text-muted-foreground">
            No creators in this view yet.
          </p>
        )}
      </section>
    </div>
  );
}

function ScopeButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
