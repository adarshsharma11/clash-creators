import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal/legal-document";
import { privacyIntro, privacySections } from "@/data/privacy";

export const metadata: Metadata = {
  title: "Privacy Policy — ClashCreators",
  description: "How ClashCreators collects, uses, and shares information.",
};

export default function PrivacyPage() {
  return (
    <LegalDocument
      title={privacyIntro.title}
      effectiveDate={privacyIntro.effectiveDate}
      lastUpdated={privacyIntro.lastUpdated}
      lead={<p>{privacyIntro.lead}</p>}
      intro={
        <p>
          Read the{" "}
          <Link href="/terms" className="font-semibold text-primary hover:text-primary/80">
            Terms of Service
          </Link>
          .
        </p>
      }
      sections={privacySections}
    />
  );
}
