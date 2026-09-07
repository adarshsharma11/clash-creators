export type Achievement = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
};

export type CreateAchievementInput = {
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
};

export type UpdateAchievementInput = Partial<CreateAchievementInput>;
