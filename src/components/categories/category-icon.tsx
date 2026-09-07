import { LayoutGrid } from "lucide-react";
import { resolveCategoryIcon } from "@/lib/brand-icons";

interface CategoryIconProps {
  name?: string | null;
  slug?: string | null;
  label?: string | null;
  className?: string;
}

export function CategoryIcon({ name, slug, label, className }: CategoryIconProps) {
  const Icon = resolveCategoryIcon(name, slug, label);
  return <Icon className={className} aria-hidden="true" />;
}

export function AllCategoriesIcon({ className }: { className?: string }) {
  return <LayoutGrid className={className} aria-hidden="true" />;
}
