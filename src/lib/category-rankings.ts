export type CategoryListItem = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  verified?: boolean;
  supportPoints: number | null;
  followers?: number;
  clashRank: number | null;
};
