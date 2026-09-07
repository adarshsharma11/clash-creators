import { Achievement } from "@/types/achievements";

export const getAchievementsForCreator = (username: string): Achievement[] => {
  // Return deterministic data based on username length/char
  const isTopTier = username.length > 8;

  return [
    {
      id: "a1",
      title: "First Crown",
      icon: "🏆",
      description: "Won a daily clash",
      isUnlocked: isTopTier,
    },
    {
      id: "a2",
      title: "3 Day Streak",
      icon: "🔥",
      description: "Top 3 for 3 consecutive days",
      isUnlocked: true,
    },
    {
      id: "a3",
      title: "Top Creator",
      icon: "👑",
      description: "Reached #1 on the global leaderboard",
      isUnlocked: isTopTier,
    },
    {
      id: "a4",
      title: "Fast Climber",
      icon: "⚡",
      description: "Gained 5 ranks in 1 hour",
      isUnlocked: true,
    },
    {
      id: "a5",
      title: "10K Support",
      icon: "💎",
      description: "Received 10,000 support points in a single clash",
      isUnlocked: true,
    },
    {
      id: "a6",
      title: "10 Day Champion",
      icon: "🔒", // Will render as locked icon if !isUnlocked
      description: "Win 10 daily clashes",
      isUnlocked: false,
    },
  ];
};
