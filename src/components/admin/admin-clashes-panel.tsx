"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/admin-data-table";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminErrorState } from "@/components/admin/admin-error-state";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { ClashStatusBadge } from "@/components/admin/admin-status-badges";
import { ClashesSkeleton } from "@/components/admin/clashes-skeleton";
import { Button } from "@/components/ui/button";
import { useAddClashParticipant } from "@/hooks/mutations/use-admin-add-participant";
import { useCompleteClash } from "@/hooks/mutations/use-admin-complete-clash";
import { useCreateClash } from "@/hooks/mutations/use-admin-create-clash";
import { useUpdateClash } from "@/hooks/mutations/use-admin-update-clash";
import { useAdminClashes } from "@/hooks/queries/use-admin-clashes";
import { useCategories } from "@/hooks/queries/use-categories";
import { formatAdminDateTime } from "@/lib/admin-format";
import { createClashSchema } from "@/lib/validations/admin";
import { getApiErrorMessage } from "@/types/api";
import type { AdminClash } from "@/types/clash";

const PAGE_SIZE = 6;
const LIVE_WINDOW_HOURS = 24;

function liveWindow(hours = LIVE_WINDOW_HOURS) {
  const startsAt = new Date();
  const endsAt = new Date(startsAt.getTime() + hours * 60 * 60 * 1000);
  return { startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString() };
}

function isWindowOpen(clash: AdminClash, now = Date.now()) {
  return new Date(clash.startsAt).getTime() <= now && now <= new Date(clash.endsAt).getTime();
}
const inputClass =
  "mt-1.5 h-11 w-full rounded-xl border border-border/50 bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function toSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function AdminClashesPanel() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [completeTarget, setCompleteTarget] = useState<AdminClash | null>(null);
  const [goLiveTarget, setGoLiveTarget] = useState<AdminClash | null>(null);
  const [addCreatorTarget, setAddCreatorTarget] = useState<AdminClash | null>(null);
  const [addUsername, setAddUsername] = useState("");
  const [addPlatform, setAddPlatform] = useState("INSTAGRAM");
  const [prize, setPrize] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("");

  const query = useAdminClashes({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  });
  const categories = useCategories();
  const createClash = useCreateClash();
  const updateClash = useUpdateClash();
  const completeClash = useCompleteClash();
  const addParticipant = useAddClashParticipant();

  const rows = query.data?.items ?? [];
  const pageCount = Math.max(1, query.data?.pagination.totalPages ?? 1);

  const columns: AdminTableColumn<AdminClash>[] = [
    { id: "clash", header: "Clash", cell: (row) => <span className="font-semibold">{row.title}</span> },
    { id: "status", header: "Status", cell: (row) => <ClashStatusBadge status={row.status} /> },
    { id: "creators", header: "Creators", cell: (row) => row._count?.participants ?? 0 },
    { id: "start", header: "Start", cell: (row) => formatAdminDateTime(row.startsAt), hideOnMobile: true },
    { id: "end", header: "End", cell: (row) => formatAdminDateTime(row.endsAt) },
    { id: "category", header: "Category", cell: (row) => row.category?.name ?? "—" },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/clash/${row.slug}`}>View</Link>
          </Button>
          {row.status === "UPCOMING" || row.status === "LIVE" ? (
            <Button size="sm" variant="ghost" onClick={() => setAddCreatorTarget(row)}>
              Add creator
            </Button>
          ) : null}
          {row.status === "UPCOMING" ? (
            <Button size="sm" variant="ghost" onClick={() => setGoLiveTarget(row)}>
              Go live
            </Button>
          ) : null}
          {row.status === "LIVE" && !isWindowOpen(row) ? (
            <Button
              size="sm"
              variant="ghost"
              disabled={updateClash.isPending}
              onClick={() => {
                updateClash.mutate(
                  { id: row.id, input: liveWindow() },
                  {
                    onSuccess: () => {
                      setFeedback(`${row.title} is accepting support for the next ${LIVE_WINDOW_HOURS} hours.`);
                    },
                    onError: (error) => {
                      setFormError(getApiErrorMessage(error));
                    },
                  }
                );
              }}
            >
              Reopen 24h
            </Button>
          ) : null}
          {row.status === "LIVE" ? (
            <Button size="sm" variant="ghost" onClick={() => setCompleteTarget(row)}>
              Complete
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setDescription("");
    setPrize("");
    setCategoryId("");
    setStartsAt("");
    setEndsAt("");
    setMaxParticipants("");
    setFieldErrors({});
    setFormError(null);
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (createClash.isPending) {
      return;
    }

    const parsed = createClashSchema.safeParse({
      title,
      slug,
      description,
      categoryId,
      startsAt,
      endsAt,
      maxParticipants,
    });

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

    const max = parsed.data.maxParticipants ? Number(parsed.data.maxParticipants) : undefined;
    createClash.mutate(
      {
        title: parsed.data.title,
        slug: parsed.data.slug,
        description: [prize.trim() ? `Prize: ${prize.trim()}` : "", parsed.data.description]
          .filter(Boolean)
          .join("\n\n") || null,
        categoryId: parsed.data.categoryId,
        startsAt: new Date(parsed.data.startsAt).toISOString(),
        endsAt: new Date(parsed.data.endsAt).toISOString(),
        maxParticipants: Number.isFinite(max) ? max : null,
      },
      {
        onSuccess: () => {
          setFeedback("Clash created.");
          resetForm();
          setCreateOpen(false);
          setPage(1);
        },
        onError: (error) => {
          setFormError(getApiErrorMessage(error));
        },
      }
    );
  };

  return (
    <div>
      <AdminPageHeader
        title="Clashes"
        description="Create a clash, collect joiners, go live, then complete it when the battle ends."
        actions={<Button onClick={() => setCreateOpen(true)}>Create Clash</Button>}
      />
      <AdminFilterBar>
        <AdminSearch
          id="admin-clashes-search"
          label="Search clashes"
          value={search}
          placeholder="Search clash name or slug"
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
      </AdminFilterBar>
      {feedback ? <p className="mb-3 text-sm text-primary">{feedback}</p> : null}
      {query.isPending ? (
        <ClashesSkeleton />
      ) : query.isError ? (
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <>
          <AdminDataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            empty={
              <AdminEmptyState
                title="No clashes found"
                description="Create a clash or clear search."
                action={
                  <Button variant="outline" onClick={() => setSearch("")}>
                    Clear search
                  </Button>
                }
              />
            }
          />
          <AdminPagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </>
      )}

      {createOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close"
            onClick={() => setCreateOpen(false)}
          />
          <form
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border/60 bg-card p-6"
            onSubmit={handleCreate}
          >
            <h2 className="text-lg font-bold">Create Clash</h2>
            <p className="mt-1 text-sm text-muted-foreground">Required fields match the backend contract.</p>
            <label htmlFor="clash-title" className="mt-4 block text-sm font-semibold">
              Title
            </label>
            <input
              id="clash-title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (!slug || slug === toSlug(title)) {
                  setSlug(toSlug(event.target.value));
                }
              }}
              className={inputClass}
            />
            {fieldErrors.title ? <p className="mt-1 text-xs text-red-400">{fieldErrors.title}</p> : null}
            <label htmlFor="clash-slug" className="mt-4 block text-sm font-semibold">
              Slug
            </label>
            <input id="clash-slug" value={slug} onChange={(event) => setSlug(event.target.value)} className={inputClass} />
            {fieldErrors.slug ? <p className="mt-1 text-xs text-red-400">{fieldErrors.slug}</p> : null}
            <label htmlFor="clash-category" className="mt-4 block text-sm font-semibold">
              Category
            </label>
            <select
              id="clash-category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className={inputClass}
            >
              <option value="">Select a category</option>
              {(categories.data ?? []).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {fieldErrors.categoryId ? <p className="mt-1 text-xs text-red-400">{fieldErrors.categoryId}</p> : null}
            <label htmlFor="clash-prize" className="mt-4 block text-sm font-semibold">
              Prize
            </label>
            <input
              id="clash-prize"
              value={prize}
              onChange={(event) => setPrize(event.target.value)}
              placeholder="Winner takes ₹2,000"
              className={inputClass}
            />
            <label htmlFor="clash-description" className="mt-4 block text-sm font-semibold">
              Description
            </label>
            <textarea
              id="clash-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={`${inputClass} h-24 py-2`}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="clash-start" className="block text-sm font-semibold">
                  Starts at
                </label>
                <input
                  id="clash-start"
                  type="datetime-local"
                  value={startsAt}
                  onChange={(event) => setStartsAt(event.target.value)}
                  className={inputClass}
                />
                {fieldErrors.startsAt ? <p className="mt-1 text-xs text-red-400">{fieldErrors.startsAt}</p> : null}
              </div>
              <div>
                <label htmlFor="clash-end" className="block text-sm font-semibold">
                  Ends at
                </label>
                <input
                  id="clash-end"
                  type="datetime-local"
                  value={endsAt}
                  onChange={(event) => setEndsAt(event.target.value)}
                  className={inputClass}
                />
                {fieldErrors.endsAt ? <p className="mt-1 text-xs text-red-400">{fieldErrors.endsAt}</p> : null}
              </div>
            </div>
            <label htmlFor="clash-max" className="mt-4 block text-sm font-semibold">
              Max participants
            </label>
            <input
              id="clash-max"
              type="number"
              min={2}
              max={64}
              value={maxParticipants}
              onChange={(event) => setMaxParticipants(event.target.value)}
              className={inputClass}
            />
            {formError ? <p className="mt-3 text-sm text-red-400">{formError}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createClash.isPending}>
                {createClash.isPending ? "Creating…" : "Create"}
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      <AdminConfirmDialog
        open={goLiveTarget !== null}
        title="Start this clash now?"
        description={
          goLiveTarget
            ? `${goLiveTarget.title} will go live immediately. Support will stay open for ${LIVE_WINDOW_HOURS} hours.`
            : ""
        }
        confirmLabel="Go Live"
        confirming={updateClash.isPending}
        onClose={() => setGoLiveTarget(null)}
        onConfirm={() => {
          if (!goLiveTarget || updateClash.isPending) {
            return;
          }
          updateClash.mutate(
            {
              id: goLiveTarget.id,
              input: {
                status: "LIVE",
                ...liveWindow(),
              },
            },
            {
              onSuccess: () => {
                setFeedback("Clash is live. Fans can support creators now.");
                setGoLiveTarget(null);
              },
              onError: (error) => {
                setFormError(getApiErrorMessage(error));
              },
            }
          );
        }}
      />

      {addCreatorTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close"
            onClick={() => setAddCreatorTarget(null)}
          />
          <form
            className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card p-6"
            onSubmit={(event) => {
              event.preventDefault();
              if (!addCreatorTarget || addParticipant.isPending) {
                return;
              }
              addParticipant.mutate(
                {
                  id: addCreatorTarget.id,
                  username: addUsername.trim(),
                  platform: addPlatform,
                },
                {
                  onSuccess: (result) => {
                    setFeedback(
                      result.alreadyJoined
                        ? `${addUsername} was already in ${addCreatorTarget.title}.`
                        : `${addUsername} added to ${addCreatorTarget.title}.`
                    );
                    setAddUsername("");
                    setAddCreatorTarget(null);
                  },
                  onError: (error) => {
                    setFormError(getApiErrorMessage(error));
                  },
                }
              );
            }}
          >
            <h2 className="text-lg font-bold">Add creator</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add an Instagram, YouTube, or other handle to {addCreatorTarget.title}.
            </p>
            <label htmlFor="add-creator-username" className="mt-4 block text-sm font-semibold">
              Username
            </label>
            <input
              id="add-creator-username"
              value={addUsername}
              onChange={(event) => setAddUsername(event.target.value)}
              className={inputClass}
              placeholder="learn_with_sam"
            />
            <label htmlFor="add-creator-platform" className="mt-4 block text-sm font-semibold">
              Platform
            </label>
            <select
              id="add-creator-platform"
              value={addPlatform}
              onChange={(event) => setAddPlatform(event.target.value)}
              className={inputClass}
            >
              <option value="INSTAGRAM">Instagram</option>
              <option value="YOUTUBE">YouTube</option>
              <option value="TIKTOK">TikTok</option>
              <option value="X">X</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="TWITCH">Twitch</option>
            </select>
            {formError ? <p className="mt-3 text-sm text-red-400">{formError}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setAddCreatorTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={addParticipant.isPending || addUsername.trim().length < 2}>
                {addParticipant.isPending ? "Adding…" : "Add"}
              </Button>
            </div>
          </form>
        </div>
      ) : null}

      <AdminConfirmDialog
        open={completeTarget !== null}
        title="Complete this clash?"
        description={
          completeTarget
            ? `${completeTarget.title} will be marked complete and a winner will be recorded if support exists.`
            : ""
        }
        confirmLabel="Complete Clash"
        confirming={completeClash.isPending}
        onClose={() => setCompleteTarget(null)}
        onConfirm={() => {
          if (!completeTarget || completeClash.isPending) {
            return;
          }
          completeClash.mutate(completeTarget.id, {
            onSuccess: () => {
              setFeedback("Clash completed.");
              setCompleteTarget(null);
            },
            onError: (error) => {
              setFormError(getApiErrorMessage(error));
            },
          });
        }}
      />
    </div>
  );
}
