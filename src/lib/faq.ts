import type { FAQFilterId, FAQItem } from "@/types/faq";

export function matchesFAQItem(item: FAQItem, query: string): boolean {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  if (item.question.toLowerCase().includes(normalized)) {
    return true;
  }

  return item.answer.some((paragraph) => paragraph.toLowerCase().includes(normalized));
}

export function filterFAQItems(
  items: readonly FAQItem[],
  query: string,
  category: FAQFilterId
): FAQItem[] {
  return items.filter((item) => {
    const matchesCategory = category === "all" || item.category === category;
    return matchesCategory && matchesFAQItem(item, query);
  });
}
