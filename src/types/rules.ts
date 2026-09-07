export type RuleSection = {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
  showRankingExample?: boolean;
};

export type RuleRankingExample = {
  rank: number;
  username: string;
  supportPoints: number;
};
