export type ClashStatus = "DRAFT" | "UPCOMING" | "LIVE" | "COMPLETED" | "CANCELLED";

export type ClashCategoryRef = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
};

export type ClashCreatorUserRef = {
  username: string;
  fullName: string;
  avatarUrl: string | null;
};

export type ClashCreatorRef = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  username?: string | null;
  status?: string;
  user?: ClashCreatorUserRef | null;
};

export type ClashListItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: ClashStatus;
  startsAt: string;
  endsAt: string;
  maxParticipants: number | null;
  participantCount: number;
  category: ClashCategoryRef | null;
};

export type ClashParticipant = {
  joinedAt: string;
  creator: ClashCreatorRef;
  points: number;
  rank: number | null;
};

export type ClashDetail = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: ClashStatus;
  startsAt: string;
  endsAt: string;
  maxParticipants: number | null;
  category: ClashCategoryRef | null;
  participants: ClashParticipant[];
  leaderboard: Array<{
    rank: number;
    points: number;
    supportCount: number;
    creatorId: string;
  }>;
  winner: {
    rank: number;
    points: number;
    creator: ClashCreatorRef;
  } | null;
};

export type ClashLeaderboardItem = {
  rank: number;
  points: number;
  supportCount: number;
  creator: ClashCreatorRef | null;
};

export type ClashWinner = {
  clash: {
    id: string;
    title: string;
    slug: string;
    status: ClashStatus;
  };
  rank: number;
  points: number;
  creator: ClashCreatorRef;
};

export type ClashListQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: ClashStatus;
};

export type ClashLeaderboardQuery = {
  page?: number;
  limit?: number;
};

export type JoinClashResult = {
  alreadyJoined?: boolean;
  participant: {
    id: string;
    joinedAt: string;
    creator: ClashCreatorRef;
  };
  clash: {
    id: string;
    title: string;
    slug: string;
    status: ClashStatus;
    startsAt: string;
    endsAt: string;
    maxParticipants: number | null;
  };
};

export type AdminClash = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  categoryId: string;
  status: ClashStatus;
  startsAt: string;
  endsAt: string;
  maxParticipants: number | null;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    name: string;
    slug: string;
  } | null;
  _count?: {
    participants: number;
  };
};

export type CreateClashInput = {
  title: string;
  slug: string;
  description?: string | null;
  categoryId: string;
  startsAt: string;
  endsAt: string;
  maxParticipants?: number | null;
};

export type UpdateClashInput = {
  title?: string;
  slug?: string;
  description?: string | null;
  categoryId?: string;
  status?: ClashStatus;
  startsAt?: string;
  endsAt?: string;
  maxParticipants?: number | null;
};

export type CompleteClashResult = {
  id: string;
  title: string;
  slug: string;
  status: ClashStatus;
};
