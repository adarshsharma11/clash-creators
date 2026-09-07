import { createElement } from "react";
import { LayoutGrid } from "lucide-react";
import { resolveCategoryIcon } from "@/lib/brand-icons";

interface CategoryIconProps {
  name?: string | null;
  slug?: string | null;
  label?: string | null;
  className?: string;
}

export function CategoryIcon({ name, slug, label, className }: CategoryIconProps) {
  return createElement(resolveCategoryIcon(name, slug, label), {
    className,
    "aria-hidden": true,
  });
}

export function AllCategoriesIcon({ className }: { className?: string }) {
  return <LayoutGrid className={className} aria-hidden="true" />;
}
