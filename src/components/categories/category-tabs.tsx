"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useCategories } from "@/hooks/queries/use-categories";
import { usePrefetchCreatorList } from "@/hooks/queries/use-creators";
import { getCategoryPath } from "@/lib/api/categories";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { AllCategoriesIcon, CategoryIcon } from "./category-icon";

function slugFromPath(pathname: string): string {
  if (pathname === "/categories") {
    return "all";
  }

  const match = pathname.match(/^\/categories\/([^/]+)/);
  return match?.[1] ?? "all";
}

export function CategoryTabs() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const active = slugFromPath(pathname);
  const navRef = useRef<HTMLElement>(null);
  const { data: categories = [], isPending } = useCategories();
  const prefetchCreatorList = usePrefetchCreatorList();

  useEffect(() => {
    const nav = navRef.current;
    const tab = nav?.querySelector<HTMLElement>(`[data-tab-id="${active}"]`);

    if (!nav || !tab) {
      return;
    }

    const navBox = nav.getBoundingClientRect();
    const tabBox = tab.getBoundingClientRect();
    const outOfView = tabBox.left < navBox.left + 8 || tabBox.right > navBox.right - 8;

    if (outOfView) {
      const nextLeft = tab.offsetLeft - (nav.clientWidth - tab.offsetWidth) / 2;
      nav.scrollTo({
        left: Math.max(0, nextLeft),
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }
  }, [active, reduceMotion, categories]);

  const tabs = [
    { id: "all", href: "/categories", label: "All", icon: null },
    ...categories.map((category) => ({
      id: category.slug,
      href: getCategoryPath(category.slug),
      label: category.name,
      icon: category.icon,
    })),
  ];

  return (
    <nav
      ref={navRef}
      aria-label="Categories"
      className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
    >
      <LayoutGroup id="category-tabs">
        <ul className="flex w-max gap-2">
          {tabs.map((tab) => {
            const selected = tab.id === active;

            return (
              <li key={tab.id}>
                <Link
                  data-tab-id={tab.id}
                  href={tab.href}
                  scroll={false}
                  aria-current={selected ? "page" : undefined}
                  onMouseEnter={() => {
                    if (tab.id !== "all") {
                      prefetchCreatorList({ category: tab.id, page: 1, limit: 50 });
                    }
                  }}
                  onFocus={() => {
                    if (tab.id !== "all") {
                      prefetchCreatorList({ category: tab.id, page: 1, limit: 50 });
                    }
                  }}
                  className={cn(
                    "relative isolate flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="category-tab-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-primary"
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: "spring", bounce: 0.12, duration: 0.5 }
                      }
                    />
                  ) : null}
                  {tab.id !== "all" ? (
                    <CategoryIcon name={tab.icon} slug={tab.id} label={tab.label} className="h-3.5 w-3.5" />
                  ) : (
                    <AllCategoriesIcon className="h-3.5 w-3.5" />
                  )}
                  {tab.label}
                </Link>
              </li>
            );
          })}
          {isPending
            ? Array.from({ length: 4 }, (_, index) => (
                <li key={`tab-skeleton-${index}`}>
                  <Skeleton className="h-9 w-24 rounded-full" />
                </li>
              ))
            : null}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
