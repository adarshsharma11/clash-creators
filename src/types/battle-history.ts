export type BattleHistory = {
  id: string;
  date: string;
  rank: number | null;
  supportPoints: number;
  title?: string;
  status?: string;
};

export type CreatorStats = {
  dailyWins: number;
  runnerUps: number;
  thirdPlace: number;
  totalSupporters: number;
  bestFinish: number;
};
