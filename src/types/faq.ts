export const FAQ_CATEGORY_IDS = [
  "getting-started",
  "battles",
  "rankings",
  "support",
  "creators",
  "categories",
  "account",
] as const;

export type FAQCategory = (typeof FAQ_CATEGORY_IDS)[number];

export type FAQFilterId = "all" | FAQCategory;

export type FAQLink = {
  label: string;
  href: string;
};

export type FAQItem = {
  id: string;
  question: string;
  answer: string[];
  category: FAQCategory;
  link?: FAQLink;
};
