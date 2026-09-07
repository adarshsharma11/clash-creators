import { BattleHistory, CreatorStats } from "@/types/battle-history";

export const getBattleHistoryForCreator = (): BattleHistory[] => {
  return [
    {
      id: "bh1",
      date: "Sept 6",
      rank: 1,
      supportPoints: 31290,
    },
    {
      id: "bh2",
      date: "Sept 5",
      rank: 2,
      supportPoints: 18410,
    },
    {
      id: "bh3",
      date: "Sept 4",
      rank: 3,
      supportPoints: 15290,
    },
    {
      id: "bh4",
      date: "Sept 3",
      rank: 8,
      supportPoints: 9200,
    },
  ];
};

export const getStatsForCreator = (username: string): CreatorStats => {
  const isTop = username === "alex_carter" || username === "sarah_fitness" || username === "mikemakesjokes";
  
  return {
    dailyWins: isTop ? 7 : 2,
    runnerUps: isTop ? 3 : 1,
    thirdPlace: isTop ? 5 : 4,
    totalSupporters: isTop ? 18291 : 4520,
    bestFinish: isTop ? 1 : 2,
  };
};
