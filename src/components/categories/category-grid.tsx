import Link from "next/link";
import { getCategoryPath } from "@/lib/api/categories";
import type { Category } from "@/types/category";
import { CategoryIcon } from "./category-icon";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight">All categories</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article
            key={category.id}
            className="rounded-2xl border border-border/50 bg-card/40 p-5"
          >
            <Link
              href={getCategoryPath(category.slug)}
              className="flex items-start gap-3 transition-colors hover:text-primary"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/70 text-primary">
                <CategoryIcon name={category.icon} className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="font-bold tracking-tight">{category.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {category.description ?? "See who leads this category."}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  View ranking
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
