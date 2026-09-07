"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { LegalSection } from "@/types/legal";

export function LegalToc({ sections }: { sections: LegalSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const headings = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (headings.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [sections]);

  const links = (
    <ol className="space-y-2 text-sm">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            onClick={() => setOpen(false)}
            className={cn(
              "block rounded-lg px-2 py-1.5 transition-colors hover:text-foreground",
              active === section.id ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground"
            )}
          >
            <span className="mr-2 font-mono text-xs">{String(index + 1).padStart(2, "0")}</span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <div className="mb-8 lg:hidden">
        <button
          type="button"
          className="flex h-11 w-full items-center justify-between rounded-xl border border-border/50 bg-card/40 px-3 text-sm font-semibold"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          On this page
          <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
        {open ? <div className="mt-3 rounded-xl border border-border/50 p-3">{links}</div> : null}
      </div>
      <aside className="sticky top-24 hidden w-56 shrink-0 lg:block">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">On this page</p>
        {links}
      </aside>
    </>
  );
}
