"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { getCategoryPath } from "@/lib/api/categories";
import type { Category } from "@/types/category";
import { CategoryIcon } from "@/components/categories/category-icon";

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-20 border-t border-border/40" id="explore-categories">
      <div className="mb-10 text-center sm:text-left">
        <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">Explore Clashes</h3>
        <p className="text-muted-foreground">
          Find battles in your favorite categories.{" "}
          <Link href="/categories" className="font-semibold text-primary hover:text-primary/80">
            Browse all
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group"
          >
            <Link
              href={getCategoryPath(category.slug)}
              className="flex flex-col items-center sm:items-start p-6 rounded-2xl border border-border/50 bg-card/30 hover:bg-card hover:border-primary/50 transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <CategoryIcon name={category.icon} className="h-6 w-6" />
              </div>
              <h4 className="font-semibold text-lg mb-1">{category.name}</h4>
              <p className="text-sm text-muted-foreground">
                {category.description ?? "Open this ranking"}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
