export type Category = {
  id: string;
  name: string;
  icon: string;
  creatorCount: number;
};

export const categories: Category[] = [
  { id: "cat_gaming", name: "Gaming", icon: "Gamepad2", creatorCount: 1420 },
  { id: "cat_fitness", name: "Fitness", icon: "Dumbbell", creatorCount: 850 },
  { id: "cat_comedy", name: "Comedy", icon: "Smile", creatorCount: 1100 },
  { id: "cat_music", name: "Music", icon: "Music", creatorCount: 920 },
  { id: "cat_ai", name: "AI", icon: "Cpu", creatorCount: 430 },
  { id: "cat_beauty", name: "Beauty", icon: "Sparkles", creatorCount: 1250 },
  { id: "cat_fashion", name: "Fashion", icon: "Shirt", creatorCount: 980 },
  { id: "cat_food", name: "Food", icon: "Utensils", creatorCount: 760 },
];

export function getCategorySlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => getCategorySlug(category.name) === slug);
}

export function getCategoryHref(name: string): string {
  return `/categories/${getCategorySlug(name)}`;
}
