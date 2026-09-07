import type { Metadata } from "next";
import Link from "next/link";
import { FAQExperience } from "@/components/faq/faq-experience";
import { faqItems } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ — ClashCreators",
  description: "Answers about Clashes, ranking, Support Points, creators, and accounts.",
};

export default function FAQPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
        <header className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.28em] text-primary">
            FAQ
          </p>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Search or filter by topic. For the full breakdown,{" "}
            <Link href="/rules" className="font-semibold text-primary hover:text-primary/80">
              read the rules
            </Link>
            . For legal terms,{" "}
            <Link href="/terms" className="font-semibold text-primary hover:text-primary/80">
              read the Terms of Service
            </Link>
            {" "}
            or the{" "}
            <Link href="/privacy" className="font-semibold text-primary hover:text-primary/80">
              Privacy Policy
            </Link>
            .
          </p>
        </header>

        <FAQExperience items={faqItems} />
      </div>
    </main>
  );
}
