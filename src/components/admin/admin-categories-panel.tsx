"use client";

import { useMemo, useState, type FormEvent } from "react";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/admin-data-table";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminErrorState } from "@/components/admin/admin-error-state";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-search";
import { CategoryStatusBadge } from "@/components/admin/admin-status-badges";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/context/admin-auth-context";
import {
  useAdminCreateCategory,
  useAdminDeleteCategory,
  useAdminUpdateCategory,
} from "@/hooks/mutations/use-admin-categories";
import { useAdminCategories } from "@/hooks/queries/use-admin-categories";
import { canDeleteCategories } from "@/lib/admin-permissions";
import { getApiErrorMessage } from "@/types/api";
import type { ApiCategory } from "@/types/category";

export function AdminCategoriesPanel() {
  const { admin } = useAdminAuth();
  const query = useAdminCategories();
  const createCategory = useAdminCreateCategory();
  const updateCategory = useAdminUpdateCategory();
  const deleteCategory = useAdminDeleteCategory();
  const canDelete = canDeleteCategories(admin?.role);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ApiCategory | null>(null);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (query.data ?? []).filter(
      (row) => row.name.toLowerCase().includes(q) || row.slug.toLowerCase().includes(q)
    );
  }, [query.data, search]);

  const columns: AdminTableColumn<ApiCategory>[] = [
    { id: "category", header: "Category", cell: (row) => <span className="font-semibold">{row.name}</span> },
    { id: "slug", header: "Slug", cell: (row) => row.slug },
    {
      id: "status",
      header: "Status",
      cell: (row) => <CategoryStatusBadge status={row.isActive ? "active" : "inactive"} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={updateCategory.isPending}
            onClick={() =>
              updateCategory.mutate(
                { id: row.id, input: { isActive: !row.isActive } },
                {
                  onSuccess: () => setFeedback(`${row.name} updated.`),
                  onError: (mutationError) => setError(getApiErrorMessage(mutationError)),
                }
              )
            }
          >
            {row.isActive ? "Deactivate" : "Activate"}
          </Button>
          {canDelete ? (
            <Button size="sm" variant="ghost" onClick={() => setPendingDelete(row)}>
              Delete
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextName = name.trim();
    const nextSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    if (!nextName || !nextSlug || createCategory.isPending) {
      return;
    }

    createCategory.mutate(
      { name: nextName, slug: nextSlug },
      {
        onSuccess: () => {
          setFeedback("Category created.");
          setName("");
          setSlug("");
          setCreateOpen(false);
        },
        onError: (mutationError) => setError(getApiErrorMessage(mutationError)),
      }
    );
  };

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Category records from the backend. Deletion is limited to Super Admins."
        actions={<Button onClick={() => setCreateOpen(true)}>Add Category</Button>}
      />
      {feedback ? <p className="mb-3 text-sm text-primary">{feedback}</p> : null}
      {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}
      <AdminFilterBar>
        <AdminSearch
          id="admin-categories-search"
          label="Search categories"
          value={search}
          placeholder="Search category or slug"
          onChange={setSearch}
        />
      </AdminFilterBar>
      {query.isError ? (
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <AdminDataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          empty={<AdminEmptyState title="No categories found" description="Add a category or clear search." />}
        />
      )}

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-black/70" aria-label="Close" onClick={() => setCreateOpen(false)} />
          <form className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card p-6" onSubmit={handleCreate}>
            <h2 className="text-lg font-bold">Add Category</h2>
            <label htmlFor="category-name" className="mt-4 block text-sm font-semibold">
              Name
            </label>
            <input
              id="category-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <label htmlFor="category-slug" className="mt-4 block text-sm font-semibold">
              Slug
            </label>
            <input
              id="category-slug"
              required
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCategory.isPending}>
                {createCategory.isPending ? "Adding…" : "Add"}
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      <AdminConfirmDialog
        open={pendingDelete !== null}
        title="Delete category?"
        description={pendingDelete ? `${pendingDelete.name} will be removed. This is only available to Super Admins.` : ""}
        confirmLabel="Delete"
        tone="danger"
        confirming={deleteCategory.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete || deleteCategory.isPending) {
            return;
          }
          deleteCategory.mutate(pendingDelete.id, {
            onSuccess: () => {
              setFeedback("Category deleted.");
              setPendingDelete(null);
            },
            onError: (mutationError) => setError(getApiErrorMessage(mutationError)),
          });
        }}
      />
    </div>
  );
}
