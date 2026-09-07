import type { RuleSection } from "@/types/rules";

export const ruleSections: RuleSection[] = [
  {
    id: "the-clash",
    number: "01",
    title: "The Clash",
    paragraphs: [
      "A Clash is a live creator battle. Fans support creators with Support Points, and the leaderboard updates as those points come in.",
      "One Clash is live at a time. When the window closes, the creator in first place takes the crown for that battle.",
    ],
    bullets: [
      "Creators compete on a shared leaderboard.",
      "Fans decide the outcome with Support Points.",
      "The #1 creator when time runs out wins the Clash.",
    ],
  },
  {
    id: "ranking",
    number: "02",
    title: "How ranking works",
    paragraphs: [
      "Creator ranking is based on the Support Points associated with the current Clash. Higher support means a higher position.",
      "Ranks are recalculated whenever support is added. A creator can rise or fall until the battle window ends.",
    ],
    bullets: [
      "Sort order is total Support Points, highest first.",
      "A creator must pass the next creator to take their place.",
      "Ties keep the existing order until one creator pulls ahead.",
    ],
    showRankingExample: true,
    note: "The example below uses today's live Clash standings.",
  },
  {
    id: "support",
    number: "03",
    title: "How Support works",
    paragraphs: [
      "Support Points are the only thing that moves a creator up the board. They are not a currency, and this MVP does not process payments.",
      "Choose a creator, pick an amount, confirm, and the local leaderboard preview updates. A real payment flow can replace confirmation later without changing this rule.",
    ],
    bullets: [
      "Preset amounts: 10, 50, 100, 250, 500, and 1,000 points.",
      "Custom amounts are allowed within the stated minimum and maximum.",
      "You can support more than one creator in the same Clash.",
    ],
  },
  {
    id: "battle-windows",
    number: "04",
    title: "Battle windows",
    paragraphs: [
      "Every Clash has a fixed start and end time. The countdown on the battle page is the source of truth for time remaining.",
      "When the window expires, support no longer changes that Clash. The final ranking becomes the official result.",
    ],
    bullets: [
      "Live battles accept support until the timer hits zero.",
      "Scheduled battles are visible before they open.",
      "Completed battles move into results and the Hall of Fame.",
    ],
  },
  {
    id: "eligibility",
    number: "05",
    title: "Creator eligibility",
    paragraphs: [
      "Only creators in the current Clash appear on that battle's leaderboard. A creator profile can exist without an active battle.",
      "Verified creators are marked on their profile. Verification is a trust signal. It does not change how Support Points are counted.",
    ],
    bullets: [
      "A creator must be entered in the Clash to receive ranked support.",
      "Category and country are shown on the profile and leaderboard.",
      "Support still works from a profile, a battle row, or a shared support URL.",
    ],
  },
  {
    id: "categories",
    number: "06",
    title: "Categories",
    paragraphs: [
      "Creators belong to a primary category such as Gaming, Fitness, Comedy, Music, AI, Beauty, Fashion, or Food.",
      "Today's Clash may highlight a category, but ranking is still decided by Support Points inside that battle.",
    ],
  },
  {
    id: "winners",
    number: "07",
    title: "Winners and the crown",
    paragraphs: [
      "The creator in first place when the Clash ends is the champion of that battle.",
      "Recent champions appear in the Hall of Fame. A win does not carry Support Points into the next Clash. Each battle starts from that day's standings.",
    ],
  },
  {
    id: "fair-play",
    number: "08",
    title: "Fair play",
    paragraphs: [
      "Support should reflect real fan backing. Do not attempt to manipulate rankings, impersonate creators, or abuse shared support links.",
      "ClashCreators may later add account checks and payment confirmation. Until then, support on this site is a frontend preview of the full flow.",
    ],
  },
];

export function getRuleSectionById(id: string): RuleSection | undefined {
  return ruleSections.find((section) => section.id === id);
}
