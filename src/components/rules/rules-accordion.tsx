"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import type { RuleRankingExample, RuleSection } from "@/types/rules";
import { AccordionItem } from "@/components/ui/accordion-item";
import { RulesSectionBody } from "./rules-section-body";
import { RulesToc } from "./rules-toc";

export type RulesAccordionItemProps = {
  title: string;
  number: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

interface RulesAccordionProps {
  sections: RuleSection[];
  rankingExample: RuleRankingExample[];
}

export function RulesAccordion({ sections, rankingExample }: RulesAccordionProps) {
  const reduceMotion = useReducedMotion();
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const openSection = useCallback((id: string, highlight = false) => {
    setOpenIds((current) => (current.includes(id) ? current : [...current, id]));
    setActiveId(id);

    if (highlight) {
      setHighlightedId(id);
      window.setTimeout(() => {
        setHighlightedId((current) => (current === id ? null : current));
      }, 1200);
    }
  }, []);

  const selectSection = useCallback(
    (id: string) => {
      openSection(id, true);
      window.history.replaceState(null, "", `#${id}`);

      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    },
    [openSection, reduceMotion]
  );

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash || !sections.some((section) => section.id === hash)) {
        return;
      }

      openSection(hash, true);
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
  }, [openSection, reduceMotion, sections]);

  const toggle = (id: string) => {
    setOpenIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
    setActiveId(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
      <div className="lg:sticky lg:top-24">
        <RulesToc sections={sections} activeId={activeId} onSelect={selectSection} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/30">
        {sections.map((section) => (
          <AccordionItem
            key={section.id}
            id={section.id}
            title={section.title}
            number={section.number}
            variant="rules"
            open={openIds.includes(section.id)}
            highlighted={highlightedId === section.id}
            onToggle={() => toggle(section.id)}
          >
            <RulesSectionBody section={section} rankingExample={rankingExample} />
          </AccordionItem>
        ))}
      </div>
    </div>
  );
}

export function RulesAccordionItem({
  title,
  number,
  children,
  defaultOpen = false,
}: RulesAccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <AccordionItem
      id={id}
      title={title}
      number={number}
      variant="rules"
      open={open}
      onToggle={() => setOpen((current) => !current)}
    >
      {children}
    </AccordionItem>
  );
}
