import { categories, getCategorySlug } from "@/data/categories";
import { currentBattle } from "@/data/battles";
import { creators } from "@/data/creators";
import type { AdminCategoryRow } from "@/types/admin";

export function getAdminCategoryRows(): AdminCategoryRow[] {
  return categories.map((category, index) => {
    const top = currentBattle.entries.find((entry) => entry.creator.category === category.name);
    const creatorCount = creators.filter((creator) => creator.category === category.name).length;

    return {
      id: category.id,
      name: category.name,
      slug: getCategorySlug(category.name),
      creatorCount,
      activeClash: category.name === currentBattle.title.split(" ")[0] ? currentBattle.title : null,
      topCreatorName: top?.creator.displayName ?? null,
      status: index === 7 ? "inactive" : "active",
    };
  });
}
