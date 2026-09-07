import type { Metadata } from "next";
import { CategoryDetailRoute } from "@/components/categories/category-detail-route";
import { getCategories } from "@/lib/api/categories";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((category) => ({ slug: category.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    title: `${name} — ClashCreators`,
    description: `See who leads ${name} in today's Clash and support your creator.`,
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  return <CategoryDetailRoute slug={slug} />;
}
