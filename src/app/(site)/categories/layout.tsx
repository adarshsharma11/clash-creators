import type { ReactNode } from "react";
import { CategoryTabs } from "@/components/categories/category-tabs";

export default function CategoriesLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col">
      <div className="container mx-auto max-w-6xl px-4 pt-12 sm:px-8 sm:pt-16">
        <div className="mb-10">
          <CategoryTabs />
        </div>
        {children}
      </div>
    </main>
  );
}
