"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { FAQFilterId, FAQItem } from "@/types/faq";
import { filterFAQItems } from "@/lib/faq";
import { FAQAccordion } from "./faq-accordion";
import { FAQEmpty } from "./faq-empty";
import { FAQFilters } from "./faq-filters";
import { FAQSearch } from "./faq-search";

interface FAQExperienceProps {
  items: FAQItem[];
}

function nextOpenIds(
  current: string[],
  visible: FAQItem[],
  query: string
): string[] {
  const visibleIds = new Set(visible.map((item) => item.id));
  const kept = current.filter((id) => visibleIds.has(id));

  if (query.trim().length >= 3 && visible.length === 1 && visible[0]) {
    return kept.includes(visible[0].id) ? kept : [visible[0].id];
  }

  return kept;
}

export function FAQExperience({ items }: FAQExperienceProps) {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<FAQFilterId>("all");
  const [openIds, setOpenIds] = useState<string[]>([]);

  const visibleItems = useMemo(
    () => filterFAQItems(items, query, category),
    [items, query, category]
  );

  const visibleOpenIds = useMemo(() => {
    const visibleIds = new Set(visibleItems.map((item) => item.id));
    return openIds.filter((id) => visibleIds.has(id));
  }, [openIds, visibleItems]);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash || !items.some((item) => item.id === hash)) {
        return;
      }

      setOpenIds((current) => (current.includes(hash) ? current : [...current, hash]));
      window.requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    };

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [items, reduceMotion]);

  const handleQueryChange = (value: string) => {
    const nextVisible = filterFAQItems(items, value, category);
    setQuery(value);
    setOpenIds((current) => nextOpenIds(current, nextVisible, value));
  };

  const handleCategoryChange = (value: FAQFilterId) => {
    const nextVisible = filterFAQItems(items, query, value);
    setCategory(value);
    setOpenIds((current) => nextOpenIds(current, nextVisible, query));
  };

  const toggle = (id: string) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const clearSearch = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <div className="space-y-6">
      <FAQSearch
        value={query}
        onChange={handleQueryChange}
        resultCount={visibleItems.length}
        totalCount={items.length}
      />
      <FAQFilters value={category} onChange={handleCategoryChange} />

      {visibleItems.length > 0 ? (
        <FAQAccordion items={visibleItems} openIds={visibleOpenIds} onToggle={toggle} />
      ) : (
        <FAQEmpty onClear={clearSearch} />
      )}
    </div>
  );
}
