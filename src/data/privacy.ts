import { legalContact } from "@/config/legal";
import { socialProfiles } from "@/config/social";
import type { LegalSection } from "@/types/legal";

export const privacyIntro = {
  title: "Privacy Policy",
  effectiveDate: legalContact.effectiveDate,
  lastUpdated: legalContact.lastUpdated,
  lead: `This Privacy Policy explains how ${legalContact.siteName} collects, uses, and shares information when you visit the site, browse Clashes, open creator pages, or use the frontend support flow. It sits alongside our Terms of Service.`,
};

export const privacySections: LegalSection[] = [
  {
    id: "who-is-responsible",
    title: "Who is responsible",
    paragraphs: [
      `${legalContact.siteName} is operated as a frontend product experience. For privacy questions, legal notices, and data requests, contact ${legalContact.email}. Public contact: ${socialProfiles.instagram.displayHandle} on Instagram.`,
    ],
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    paragraphs: [
      "We keep the Service small. This MVP does not create accounts, process payments, or store Support Points in a production database. We collect only what is needed to serve the site and respond to you.",
    ],
    bullets: [
      "Messages you send us. If you email a notice, a question, or a privacy request, we keep that correspondence as needed to respond and to keep a legal record.",
      "Technical data. Standard request data such as user agent, referrer, and IP address may be processed by the host that serves the site, so the pages can load and stay secure.",
      "Support flow state. Choosing Support Points and confirming support happens in your browser for this MVP. That preview is not written to our server.",
    ],
  },
  {
    id: "what-we-do-not-collect",
    title: "What we do not collect",
    paragraphs: [
      "We do not collect payment-card numbers, billing identity, UPI details, or checkout IDs. Support Points are not money, and there is no payment processor on the Service today.",
      "We do not run a product-email digest, so we do not collect a newsletter address. We do not set a visitor-ID cookie, and we do not use an advertising pixel or a third-party analytics product on this MVP.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies",
    paragraphs: [
      "The Service does not set its own tracking cookies. Your browser or the host may still use strictly necessary cookies or cache so the site can load. We do not use cookies for advertising.",
    ],
  },
  {
    id: "why-we-use-data",
    title: "Why we use this data",
    paragraphs: ["We use information only for:"],
    bullets: [
      "Operating the Service you asked to view: pages, leaderboards, creator profiles, and the support preview.",
      "Responding to email or Instagram messages you send us.",
      "Keeping the site secure and debugging outages when host logs are needed.",
      "Keeping a record of legal or rights notices you send.",
    ],
  },
  {
    id: "public-pages",
    title: "Public pages",
    paragraphs: [
      "Creator names, avatars, categories, ranks, and Support Point totals shown on ClashCreators are public on the site. In this MVP those values come from deterministic dummy data, not from a live payment or account system.",
      "Do not treat a displayed profile as a private record. Anyone who opens the site can see it.",
    ],
  },
  {
    id: "who-we-share-with",
    title: "Who we share data with",
    paragraphs: [
      "We do not sell personal data. We do not share data with a payment processor or an analytics vendor on this MVP.",
      "Hosting and edge infrastructure may process technical request data so the site can run. If you email us, that message is processed by the email provider that delivers it.",
      "We may share information with professional advisers, authorities, or a buyer of the Service if we must do so to comply with law, enforce the Terms, or transfer the project.",
    ],
  },
  {
    id: "how-long",
    title: "How long we keep it",
    paragraphs: [
      "Email and Instagram correspondence is kept as long as needed to respond, handle a complaint, or keep a legal record.",
      "Host request logs follow the retention of the provider that serves the site.",
      "Browser-only support previews last until you leave or refresh the page.",
    ],
  },
  {
    id: "your-rights",
    title: "Your rights",
    paragraphs: [
      `If the GDPR or similar law applies to you, you may ask us to access, correct, delete, or export personal data we hold about you, to restrict or object to certain processing, and to withdraw consent where processing was based on consent. You may also lodge a complaint with a supervisory authority in your country of residence.`,
      `Email ${legalContact.email}. We may need enough information to find your data. Dummy creator pages on the board are product content, not a private account; you can still ask us to change or remove a page if you have a legal reason.`,
    ],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "The Service is for adults. We do not knowingly collect personal data from children. If you believe a child has used the Service or emailed us, contact us and we will delete the data we can identify.",
    ],
  },
  {
    id: "changes",
    title: "Changes",
    paragraphs: [
      "We may update this policy when the Service or the law changes. The date at the top of this page is the current version. If a change is material, we will post the updated policy here. A later version that collects payments, accounts, or emails will describe that collection before it starts.",
    ],
  },
];
