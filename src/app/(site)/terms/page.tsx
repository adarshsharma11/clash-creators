import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal/legal-document";
import { termsIntro, termsSections } from "@/data/terms";

export const metadata: Metadata = {
  title: "Terms of Service — ClashCreators",
  description: "Terms that govern access to and use of ClashCreators.",
};

export default function TermsPage() {
  return (
    <LegalDocument
      title={termsIntro.title}
      effectiveDate={termsIntro.effectiveDate}
      lastUpdated={termsIntro.lastUpdated}
      lead={<p>{termsIntro.lead}</p>}
      intro={
        <p>
          {termsIntro.disagreement}{" "}
          <Link href="/rules" className="font-semibold text-primary hover:text-primary/80">
            Read the Rules
          </Link>
          , the{" "}
          <Link href="/privacy" className="font-semibold text-primary hover:text-primary/80">
            Privacy Policy
          </Link>
          , or the{" "}
          <Link href="/faq" className="font-semibold text-primary hover:text-primary/80">
            FAQ
          </Link>
          .
        </p>
      }
      sections={termsSections}
    />
  );
}
