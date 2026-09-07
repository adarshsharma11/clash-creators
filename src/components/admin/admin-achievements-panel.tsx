"use client";

import { useState, type FormEvent } from "react";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/admin-data-table";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminErrorState } from "@/components/admin/admin-error-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { Button } from "@/components/ui/button";
import { useCreateAchievement } from "@/hooks/mutations/use-admin-create-achievement";
import { useDeleteAchievement } from "@/hooks/mutations/use-admin-delete-achievement";
import { useAdminAchievements } from "@/hooks/queries/use-admin-achievements";
import { createAchievementSchema } from "@/lib/validations/admin";
import { useAdminAuth } from "@/context/admin-auth-context";
import { canDeleteAchievements } from "@/lib/admin-permissions";
import { AchievementIcon } from "@/components/ui/achievement-icon";
import { getApiErrorMessage } from "@/types/api";
import type { Achievement } from "@/types/achievement";

const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function AdminAchievementsPanel() {
  const { admin } = useAdminAuth();
  const canDelete = canDeleteAchievements(admin?.role);
  const query = useAdminAchievements();
  const createAchievement = useCreateAchievement();
  const deleteAchievement = useDeleteAchievement();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Achievement | null>(null);

  const rows = query.data ?? [];

  const columns: AdminTableColumn<Achievement>[] = [
    { id: "name", header: "Name", cell: (row) => <span className="font-semibold">{row.name}</span> },
    { id: "slug", header: "Slug", cell: (row) => row.slug },
    {
      id: "icon",
      header: "Icon",
      cell: (row) => (
        <span className="inline-flex items-center gap-2 text-primary">
          <AchievementIcon icon={row.icon} slug={row.slug} title={row.name} className="h-4 w-4" />
          <span className="text-xs text-muted-foreground">{row.icon ?? row.slug}</span>
        </span>
      ),
    },
    { id: "description", header: "Description", cell: (row) => row.description ?? "—" },
    {
      id: "actions",
      header: "Actions",
      cell: (row) =>
        canDelete ? (
          <Button size="sm" variant="ghost" onClick={() => setPendingDelete(row)}>
            Delete
          </Button>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
  ];

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (createAchievement.isPending) {
      return;
    }

    const parsed = createAchievementSchema.safeParse({ name, slug, description, icon });
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !nextErrors[key]) {
          nextErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextErrors);
      return;
    }

    setFieldErrors({});
    setError(null);
    createAchievement.mutate(
      {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        icon: parsed.data.icon || null,
      },
      {
        onSuccess: () => {
          setFeedback("Achievement created.");
          setName("");
          setSlug("");
          setDescription("");
          setIcon("");
        },
        onError: (mutationError) => {
          setError(getApiErrorMessage(mutationError));
        },
      }
    );
  };

  return (
    <div>
      <AdminPageHeader
        title="Achievements"
        description="Create achievement definitions. Deletion is limited to Super Admins."
      />
      {feedback ? <p className="mb-3 text-sm text-primary">{feedback}</p> : null}
      {error ? <p className="mb-3 text-sm text-red-400">{error}</p> : null}

      <form className="mb-8 rounded-2xl border border-border/50 p-5" onSubmit={handleCreate}>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Create achievement
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="achievement-name" className="text-sm font-semibold">
              Name
            </label>
            <input id="achievement-name" value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
            {fieldErrors.name ? <p className="mt-1 text-xs text-red-400">{fieldErrors.name}</p> : null}
          </div>
          <div>
            <label htmlFor="achievement-slug" className="text-sm font-semibold">
              Slug
            </label>
            <input id="achievement-slug" value={slug} onChange={(event) => setSlug(event.target.value)} className={inputClass} />
            {fieldErrors.slug ? <p className="mt-1 text-xs text-red-400">{fieldErrors.slug}</p> : null}
          </div>
        </div>
        <label htmlFor="achievement-icon" className="mt-4 block text-sm font-semibold">
          Icon
        </label>
        <input id="achievement-icon" value={icon} onChange={(event) => setIcon(event.target.value)} className={inputClass} />
        <label htmlFor="achievement-description" className="mt-4 block text-sm font-semibold">
          Description
        </label>
        <textarea
          id="achievement-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className={`${inputClass} h-20 py-2`}
        />
        <div className="mt-4">
          <Button type="submit" disabled={createAchievement.isPending}>
            {createAchievement.isPending ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>

      {query.isPending ? (
        <p className="rounded-2xl border border-border/50 px-6 py-12 text-center text-sm text-muted-foreground">
          Loading achievements…
        </p>
      ) : query.isError ? (
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <AdminDataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.id}
          empty={<AdminEmptyState title="No achievements yet" description="Create the first achievement above." />}
        />
      )}

      <AdminConfirmDialog
        open={pendingDelete !== null}
        title="Delete achievement?"
        description={
          pendingDelete
            ? `${pendingDelete.name} will be removed. This fails if it has already been awarded.`
            : ""
        }
        confirmLabel="Delete"
        tone="danger"
        confirming={deleteAchievement.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete || deleteAchievement.isPending) {
            return;
          }
          deleteAchievement.mutate(pendingDelete.id, {
            onSuccess: () => {
              setFeedback("Achievement deleted.");
              setPendingDelete(null);
            },
            onError: (mutationError) => {
              setError(getApiErrorMessage(mutationError));
            },
          });
        }}
      />
    </div>
  );
}
