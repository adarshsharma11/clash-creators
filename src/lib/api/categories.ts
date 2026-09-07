import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiCategory, Category } from "@/types/category";

function toCategory(category: ApiCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon ?? "",
    description: category.description ?? undefined,
  };
}

export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  const categories = await apiClient.get<ApiCategory[]>(API_ENDPOINTS.categories.list, { signal });

  return categories
    .filter((category) => category.isActive)
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map(toCategory);
}

export async function getCategory(slug: string, signal?: AbortSignal): Promise<Category> {
  const category = await apiClient.get<ApiCategory>(API_ENDPOINTS.categories.detail(slug), { signal });
  return toCategory(category);
}

export async function getAdminCategories(signal?: AbortSignal): Promise<ApiCategory[]> {
  return apiClient.get<ApiCategory[]>(API_ENDPOINTS.categories.list, { signal });
}

export function createCategory(
  input: {
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    isActive?: boolean;
    sortOrder?: number;
  },
  signal?: AbortSignal
): Promise<ApiCategory> {
  return apiClient.post<ApiCategory>(API_ENDPOINTS.categories.list, input, { signal });
}

export function updateCategory(
  id: string,
  input: Partial<{
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    isActive: boolean;
    sortOrder: number;
  }>,
  signal?: AbortSignal
): Promise<ApiCategory> {
  return apiClient.put<ApiCategory>(API_ENDPOINTS.categories.detail(id), input, { signal });
}

export function deleteCategory(id: string, signal?: AbortSignal): Promise<{ message?: string }> {
  return apiClient.delete<{ message?: string }>(API_ENDPOINTS.categories.detail(id), { signal });
}

export function getCategoryPath(slug: string): string {
  return `/categories/${slug}`;
}
