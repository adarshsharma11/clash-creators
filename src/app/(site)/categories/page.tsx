import type { Metadata } from "next";
import { CategoriesExperience } from "@/components/categories/categories-experience";

export const metadata: Metadata = {
  title: "Categories — ClashCreators",
  description: "Every category has its own ranking. Pick one to see who leads it.",
};

export default function CategoriesPage() {
  return <CategoriesExperience />;
}
