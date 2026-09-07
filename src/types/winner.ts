export type HallOfFameWinner = {
  id: string;
  date: string;
  creator: {
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
  supportPoints: number;
  title: string;
  clashTitle?: string;
  clashSlug?: string;
  categoryName?: string;
};

export type WinnerListQuery = {
  page?: number;
  limit?: number;
  category?: string;
  clashId?: string;
  from?: string;
  to?: string;
};

export type WinnerListItem = {
  rank: number;
  points: number;
  createdAt: string;
  creator: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    user: {
      username: string;
      fullName: string;
      avatarUrl: string | null;
    };
  };
  clash: {
    id: string;
    title: string;
    slug: string;
    status: string;
    endsAt: string;
    category: {
      name: string;
      slug: string;
    } | null;
  };
};
