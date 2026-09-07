import type { ReactNode } from "react";
import { legalContact } from "@/config/legal";
import { socialProfiles } from "@/config/social";
import type { LegalSection } from "@/types/legal";

type LegalDocumentProps = {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  lead: ReactNode;
  intro?: ReactNode;
  sections: LegalSection[];
};

export function LegalDocument({
  title,
  effectiveDate,
  lastUpdated,
  lead,
  intro,
  sections,
}: LegalDocumentProps) {
  return (
    <main className="flex flex-1 flex-col">
      <article className="container mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="mb-12 border-b border-border/40 pb-10">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-primary">
            Legal
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective {effectiveDate}. Last updated {lastUpdated}.
          </p>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
            {lead}
            {intro}
          </div>
        </header>

        <div className="mb-10 rounded-2xl border border-border/50 bg-card/40 p-5 text-sm">
          <p className="font-semibold">Contact</p>
          <p className="mt-2 text-muted-foreground">
            Email:{" "}
            <a
              href={legalContact.emailHref}
              className="font-medium text-primary hover:text-primary/80"
            >
              {legalContact.email}
            </a>
          </p>
          <p className="mt-1 text-muted-foreground">
            Instagram:{" "}
            {socialProfiles.instagram.url ? (
              <a
                href={socialProfiles.instagram.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:text-primary/80"
              >
                {socialProfiles.instagram.displayHandle}
              </a>
            ) : (
              socialProfiles.instagram.displayHandle
            )}
          </p>
        </div>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="mb-3 text-xl font-bold tracking-tight">
                <span className="mr-3 font-mono text-sm text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {section.title}
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
