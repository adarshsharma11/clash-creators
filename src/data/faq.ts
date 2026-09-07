import { legalContact } from "@/config/legal";
import { socialProfiles } from "@/config/social";
import type { FAQFilterId, FAQItem } from "@/types/faq";

export const faqFilters: { id: FAQFilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "getting-started", label: "Getting Started" },
  { id: "battles", label: "Battles" },
  { id: "rankings", label: "Rankings" },
  { id: "support", label: "Support" },
  { id: "creators", label: "Creators" },
  { id: "categories", label: "Categories" },
  { id: "account", label: "Account" },
];

export const faqItems: FAQItem[] = [
  {
    id: "how-it-works",
    question: "How does ClashCreators work?",
    category: "getting-started",
    answer: [
      "Creators enter a live Clash. Fans give them Support Points. The leaderboard reorders as support comes in, and the creator in first at the end takes the crown.",
    ],
    link: { label: "View Rules", href: "/rules#the-clash" },
  },
  {
    id: "need-account-to-watch",
    question: "Do I need an account to watch a Clash?",
    category: "getting-started",
    answer: [
      "No. Anyone can open today's Clash, browse creators, and follow the countdown without signing in.",
    ],
  },
  {
    id: "is-it-live",
    question: "Is ClashCreators live right now?",
    category: "getting-started",
    answer: [
      "Yes. The current battle is marked Live in the header. Open Today's Clash to see standings and time remaining.",
    ],
    link: { label: "View today's Clash", href: "/#creators" },
  },
  {
    id: "what-is-a-clash",
    question: "What is a Clash?",
    category: "battles",
    answer: [
      "A Clash is a timed creator battle with one shared leaderboard. Support Points decide the order, and the window has a clear start and end.",
    ],
    link: { label: "View Rules", href: "/rules#the-clash" },
  },
  {
    id: "what-happens-when-clash-ends",
    question: "What happens when a Clash ends?",
    category: "battles",
    answer: [
      "Support stops counting for that battle. The final #1 creator is the champion, and the result can appear in the Hall of Fame. The next Clash starts from a new board.",
    ],
    link: { label: "View Rules", href: "/rules#winners" },
  },
  {
    id: "how-long-does-a-clash-last",
    question: "How long does a Clash last?",
    category: "battles",
    answer: [
      "Each Clash uses a fixed battle window. The countdown on the battle page shows exactly how much time is left.",
    ],
    link: { label: "View Rules", href: "/rules#battle-windows" },
  },
  {
    id: "how-ranking-works",
    question: "How does ranking work?",
    category: "rankings",
    answer: [
      "Creator ranking is based on the support associated with the current Clash. Higher support results in a higher position.",
    ],
    link: { label: "View Rules", href: "/rules#ranking" },
  },
  {
    id: "can-rank-change",
    question: "Can a creator's rank change?",
    category: "rankings",
    answer: [
      "Yes. Rank can change any time support is added, until the Clash ends. Passing another creator requires more Support Points than they currently have.",
    ],
  },
  {
    id: "support-affects-ranking",
    question: "How does support affect ranking?",
    category: "rankings",
    answer: [
      "Each confirmed support amount is added to that creator's total. The board is then re-sorted from highest support to lowest.",
    ],
    link: { label: "View Rules", href: "/rules#ranking" },
  },
  {
    id: "ranking-ties",
    question: "What if two creators have the same support?",
    category: "rankings",
    answer: [
      "The existing order stays until one creator moves ahead. Equal support does not swap places on its own.",
    ],
  },
  {
    id: "how-to-support",
    question: "How can I support a creator?",
    category: "support",
    answer: [
      "Open a creator profile, a battle row, or a support URL. Choose a Support Point amount, review the rank preview, and confirm. No payment is collected on this page yet.",
    ],
    link: { label: "View Rules", href: "/rules#support" },
  },
  {
    id: "are-points-money",
    question: "Are Support Points money?",
    category: "support",
    answer: [
      "No. Support Points move a creator on the Clash leaderboard. They are not a currency, and ClashCreators does not charge a card or UPI amount in this MVP.",
    ],
  },
  {
    id: "support-multiple",
    question: "Can I support more than one creator?",
    category: "support",
    answer: [
      "Yes. Support is per creator. You can back more than one person in the same Clash.",
    ],
  },
  {
    id: "find-a-creator",
    question: "How do I find a creator?",
    category: "creators",
    answer: [
      "Use today's Clash leaderboard, open a creator from the top three, or visit a shared profile URL at /creators/[username].",
    ],
  },
  {
    id: "creator-profile",
    question: "What is on a creator profile?",
    category: "creators",
    answer: [
      "A profile shows identity, category, current Clash position when they are competing, recent history, and a Support Creator action.",
    ],
  },
  {
    id: "how-categories-work",
    question: "How do categories work?",
    category: "categories",
    answer: [
      "Each creator has a primary category. You can browse clashes by category, but ranking inside a Clash is still decided by Support Points.",
    ],
    link: { label: "View Rules", href: "/rules#categories" },
  },
  {
    id: "multiple-categories",
    question: "Can a creator compete in more than one category?",
    category: "categories",
    answer: [
      "In this MVP, a creator has one primary category. A future Clash may be themed around a category, but the creator's listed category stays the same.",
    ],
  },
  {
    id: "need-to-sign-in",
    question: "Do I need to sign in?",
    category: "account",
    answer: [
      "Not for this MVP. You can watch battles and complete the frontend support flow without an account. Sign In is reserved for a later release.",
    ],
  },
  {
    id: "is-payment-required",
    question: "Is payment required to support a creator?",
    category: "account",
    answer: [
      "Not yet. Confirmation simulates support locally so the product flow can be tested. A real payment step can replace that confirmation later.",
    ],
    link: { label: "View Rules", href: "/rules#support" },
  },
  {
    id: "how-to-contact",
    question: "How do I contact ClashCreators?",
    category: "account",
    answer: [
      `Email ${legalContact.email} or message ${socialProfiles.instagram.displayHandle} on Instagram. The Terms of Service and Privacy Policy explain how we use the site and how to send a rights or data request.`,
    ],
    link: { label: "View Terms", href: "/terms" },
  },
];

export function getFAQItemById(id: string): FAQItem | undefined {
  return faqItems.find((item) => item.id === id);
}
