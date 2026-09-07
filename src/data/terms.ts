import { legalContact } from "@/config/legal";
import { socialProfiles } from "@/config/social";
import type { LegalSection } from "@/types/legal";

export type TermsSection = LegalSection;

export const termsIntro = {
  title: "Terms of Service",
  effectiveDate: legalContact.effectiveDate,
  lastUpdated: legalContact.lastUpdated,
  lead: `These Terms of Service ("Terms") govern access to and use of ${legalContact.siteName} (the "Service"), including the public Clash leaderboards, creator pages, support flow, categories, and related features. By using the Service you agree to these Terms.`,
  disagreement:
    "If you do not agree, do not use the Service. These Terms work together with the public Rules. If the Rules and these Terms conflict, these Terms control.",
};

export const termsSections: TermsSection[] = [
  {
    id: "operator",
    title: "Operator and contact",
    paragraphs: [
      `${legalContact.siteName} is operated as a frontend product experience. Legal and listing notices: ${legalContact.email}. Public contact: ${socialProfiles.instagram.displayHandle} on Instagram.`,
    ],
  },
  {
    id: "what-the-service-is",
    title: "What the Service is",
    paragraphs: [
      `${legalContact.siteName} is a public creator-competition website. Creators appear in Clashes. Supporters can choose Support Points and confirm a frontend support flow that previews how a creator might move on the board.`,
      "The current Service is a frontend-only MVP. It does not process real payments, does not create a real account, and does not store support in a production database. Support Points are not money. Confirming support on this site does not buy traffic, customers, revenue, exclusive placement, or a guaranteed rank.",
      "Leaderboards, creator profiles, winners, and categories on the Service use deterministic dummy data for demonstration. We may change, pause, or discontinue features, including ranking displays and support previews.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    paragraphs: [
      "You must be at least 18 years old and able to form a binding contract.",
      "If you use the Service for a company, you represent that you have authority to bind that company, and \"you\" includes that company.",
      "You may not use the Service if you are prohibited from receiving services under applicable law, including trade sanctions.",
    ],
  },
  {
    id: "support-points",
    title: "Support Points",
    paragraphs: [
      "Support Points are a product mechanic used to show how a creator could climb a Clash. They are not a currency and are not converted to rupees, dollars, or any other payment method on this MVP.",
      "There is no checkout, card collection, UPI, or payment processor on the Service today. A later version may replace the confirm step with a real payment flow. Those Terms will be updated before any real payment is collected.",
    ],
  },
  {
    id: "your-warranties",
    title: "Your warranties",
    paragraphs: ["By using the Service you represent and warrant that:"],
    bullets: [
      "You will use the Service lawfully and will not impersonate a creator, brand, or company.",
      "You will not attempt to manipulate rankings, scrape the Service beyond ordinary browsing, or interfere with its operation.",
      "Information you submit, if any, is accurate to the best of your knowledge.",
    ],
  },
  {
    id: "prohibited-use",
    title: "Prohibited use",
    paragraphs: ["You may not use the Service for:"],
    bullets: [
      "Illegal, fraudulent, defamatory, harassing, hateful, or violent activity, or any content that exploits children.",
      "Malware, phishing, scams, or destinations whose primary purpose is to deceive visitors.",
      "Automated abuse, bypassing rate limits, or reverse engineering except as allowed by mandatory law.",
    ],
  },
  {
    id: "our-rights",
    title: "Our right to change or remove access",
    paragraphs: [
      "We may refuse, hide, edit, or remove pages, dummy listings, or features when we believe these Terms, the Rules, or the law may have been broken, or where we think continued display creates legal, security, or reputational risk.",
    ],
  },
  {
    id: "third-party",
    title: "Third-party content and no endorsement",
    paragraphs: [
      "Creator names, avatars, and category labels on the Service are used to identify dummy or displayed profiles. Appearance on a Clash or Hall of Fame is not our opinion of a creator and is not a certification or endorsement.",
      "Support totals, ranks, and social-proof numbers describe what the current demo data or local preview shows. They are not a promise that a creator will get the same outcome later.",
      "Links from the Service to creator pages, Clashes, or third-party sites leave this page's context. Those destinations have their own terms. We are not responsible for them.",
      `${legalContact.siteName}, the wordmark, and the look of the Service are ours. You may not copy the Service or use our brand in a way that suggests we endorse you.`,
    ],
  },
  {
    id: "complaints",
    title: "Complaints and rights notices",
    paragraphs: [
      `If you believe a page on the Service infringes your copyright, trademark, publicity, or other rights, or that displayed content is unlawful, email ${legalContact.email} with: (1) your name and contact details; (2) the page URL on ${legalContact.siteName}; (3) a description of the problem; and (4) a statement that the notice is accurate and that you are the rights holder or authorized to act.`,
      "We may hide or change the page while we review the notice. Repeat or abusive notices may be ignored.",
    ],
  },
  {
    id: "availability",
    title: "Availability and changes",
    paragraphs: [
      "We provide the Service as-is. It may be unavailable, slow, or incorrect. We may change ranking displays, categories, or these Terms. If a change is material, we will update the date at the top of this page. Continued use after a change means you accept the new Terms.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    paragraphs: [
      "To the fullest extent permitted by law, we disclaim all warranties, express or implied, including merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Service will be uninterrupted, secure, or free of errors, or that names, images, ranks, or support totals are accurate or complete.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "We do not limit liability that applicable law says we cannot limit. Subject to that, we are not liable for lost profits, lost data, lost goodwill, or other indirect or consequential damages arising from use of this frontend MVP.",
    ],
  },
  {
    id: "general",
    title: "General",
    paragraphs: [
      "If a part of these Terms is unenforceable, the rest remains in effect.",
      "Our failure to enforce a provision is not a waiver.",
      "These Terms, the Rules, and the Privacy Policy form the agreement for using the Service in its current MVP form.",
      `Questions: ${legalContact.email}.`,
    ],
  },
];
