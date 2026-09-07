export type CreatorCategory =
  | "Gaming"
  | "Fitness"
  | "Comedy"
  | "Music"
  | "AI"
  | "Beauty"
  | "Fashion"
  | "Food";

const CREATOR_CATEGORIES: readonly CreatorCategory[] = [
  "Gaming",
  "Fitness",
  "Comedy",
  "Music",
  "AI",
  "Beauty",
  "Fashion",
  "Food",
];

export function isCreatorCategory(name: string): name is CreatorCategory {
  return CREATOR_CATEGORIES.some((category) => category === name);
}

export type Creator = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  category?: string;
  country?: string;
  followers?: number;
  verified?: boolean;
  bio?: string | null;
};

export type CreatorStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type SocialPlatform = "INSTAGRAM" | "YOUTUBE" | "TIKTOK" | "X" | "FACEBOOK" | "TWITCH";

export type CreatorSocialAccount = {
  platform: SocialPlatform;
  username: string | null;
  displayName: string | null;
  profileUrl: string | null;
  isPrimary: boolean;
  isVerified: boolean;
};

export type UpdateCreatorProfileInput = {
  displayName?: string;
  bio?: string | null;
  avatarUrl?: string | null;
  categoryId?: string | null;
};

export type UpsertCreatorSocialInput = {
  platform: SocialPlatform;
  username?: string | null;
  displayName?: string | null;
  profileUrl: string;
  isPrimary?: boolean;
};

export type CreatorSupportItem = {
  id: string;
  points: number;
  createdAt: string;
  clash: {
    id: string;
    title: string;
    slug: string;
    status: string;
  };
  supporter: {
    username: string;
    fullName: string;
    avatarUrl: string | null;
  } | null;
};

export type CreatorCategoryRef = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
};

export type CreatorSupportTotals = {
  points: number;
  count: number;
};

export type CreatorClashStatistics = {
  clashes?: number;
  wins: number;
};

export type CreatorCurrentClash = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED";
  startsAt: string;
  endsAt: string;
};

export type CreatorRecentClash = CreatorCurrentClash & {
  category: {
    name: string;
    slug: string;
  } | null;
};

export type CreatorAchievement = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  earnedAt: string;
};

export type CreatorListItem = {
  id: string;
  username: string;
  fullName: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  status: CreatorStatus;
  category: CreatorCategoryRef | null;
  socialAccounts: CreatorSocialAccount[];
  supportTotals: CreatorSupportTotals;
  clashStatistics: {
    clashes: number;
    wins: number;
  };
};

export type CreatorDetail = {
  id: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  status: CreatorStatus;
  user: {
    username: string;
    fullName: string;
    avatarUrl: string | null;
  };
  category: CreatorCategoryRef | null;
  socialAccounts: CreatorSocialAccount[];
  supportTotals: CreatorSupportTotals;
  clashStatistics: CreatorClashStatistics;
  currentClash: CreatorCurrentClash | null;
  recentClashes: CreatorRecentClash[];
  achievements: CreatorAchievement[];
  wins: number;
};

export type CreatorClashItem = {
  joinedAt: string;
  clash: {
    id: string;
    title: string;
    slug: string;
    status: CreatorCurrentClash["status"];
    startsAt: string;
    endsAt: string;
    category: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
  supportPoints: number;
  finalRank: number | null;
};

export type CreatorSupporter = {
  username: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  points: number;
  supportCount: number;
};

export type CreatorListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: CreatorStatus;
};

export type CreatorClashQuery = {
  page?: number;
  limit?: number;
  status?: CreatorCurrentClash["status"];
};
