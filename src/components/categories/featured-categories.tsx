import Link from "next/link";
import { getCategoryPath } from "@/lib/api/categories";
import type { Category } from "@/types/category";
import { CategoryIcon } from "./category-icon";

interface FeaturedCategoriesProps {
  categories: Category[];
}

export function FeaturedCategories({ categories }: FeaturedCategoriesProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="rounded-[1.75rem] border border-border/40 bg-primary/[0.04] p-6 sm:p-8">
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          Most active categories
        </div>
        <p className="text-sm text-muted-foreground">
          Browse the categories that define today&apos;s Clash.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            href={getCategoryPath(category.slug)}
            className="rounded-2xl border border-border/50 bg-card/70 p-5 transition-colors hover:border-primary/40"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/70 text-primary">
                <CategoryIcon name={category.icon} className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                #{index + 1}
                {index === 0 ? " Hottest" : ""}
              </span>
            </div>

            <h3 className="mb-2 text-lg font-bold tracking-tight">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {category.description ?? "Open this ranking to see who is competing."}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
