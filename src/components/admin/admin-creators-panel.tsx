"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/admin-data-table";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminErrorState } from "@/components/admin/admin-error-state";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { CreatorStatusBadge } from "@/components/admin/admin-status-badges";
import { CreatorsSkeleton } from "@/components/admin/creators-skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useUpdateCreatorStatus } from "@/hooks/mutations/use-admin-creator-status";
import { useAdminCreators } from "@/hooks/queries/use-admin-creators";
import { formatAdminDate } from "@/lib/admin-format";
import { getApiErrorMessage } from "@/types/api";
import type { AdminCreator, CreatorStatus } from "@/types/admin";

const PAGE_SIZE = 8;

export function AdminCreatorsPanel() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<AdminCreator | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const updateStatus = useUpdateCreatorStatus();
  const { notify } = useToast();

  const query = useAdminCreators({
    page,
    limit: PAGE_SIZE,
    search: search.trim() || undefined,
  });

  const rows = query.data?.items ?? [];
  const pageCount = Math.max(1, query.data?.pagination.totalPages ?? 1);

  const columns: AdminTableColumn<AdminCreator>[] = [
    {
      id: "creator",
      header: "Creator",
      cell: (row) => (
        <div>
          <p className="font-semibold">{row.displayName}</p>
          <p className="text-xs text-muted-foreground">@{row.user.username}</p>
        </div>
      ),
    },
    { id: "username", header: "Username", cell: (row) => `@${row.user.username}`, hideOnMobile: true },
    { id: "category", header: "Category", cell: (row) => row.category?.name ?? "—" },
    { id: "status", header: "Status", cell: (row) => <CreatorStatusBadge status={row.status} /> },
    { id: "joined", header: "Joined", cell: (row) => formatAdminDate(row.createdAt) },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href={`/creators/${row.user.username}`}>View</Link>
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setPending(row)}>
            {row.status === "SUSPENDED" ? "Restore" : "Suspend"}
          </Button>
        </div>
      ),
    },
  ];

  const nextStatus: CreatorStatus = pending?.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";

  return (
    <div>
      <AdminPageHeader
        title="Creators"
        description="Manage creator status. Changes are saved to the backend."
      />
      <AdminFilterBar>
        <AdminSearch
          id="admin-creators-search"
          label="Search creators"
          value={search}
          placeholder="Search name, username, or email"
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
      </AdminFilterBar>
      {feedback ? <p className="mb-3 text-sm text-primary">{feedback}</p> : null}
      {actionError ? <p className="mb-3 text-sm text-red-400">{actionError}</p> : null}
      {query.isPending ? (
        <CreatorsSkeleton />
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
                title="No creators found"
                description="Try a different search, or clear the filter."
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

      <AdminConfirmDialog
        open={pending !== null}
        title={pending?.status === "SUSPENDED" ? "Restore creator?" : "Suspend creator?"}
        description={
          pending
            ? pending.status === "SUSPENDED"
              ? `@${pending.user.username} will be marked active again.`
              : `@${pending.user.username} will be suspended.`
            : ""
        }
        confirmLabel={pending?.status === "SUSPENDED" ? "Restore" : "Suspend Creator"}
        tone={pending?.status === "SUSPENDED" ? "default" : "danger"}
        confirming={updateStatus.isPending}
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending || updateStatus.isPending) {
            return;
          }
          setActionError(null);
          updateStatus.mutate(
            { id: pending.id, status: nextStatus },
            {
              onSuccess: () => {
                setFeedback(
                  nextStatus === "SUSPENDED" ? "Creator suspended." : "Creator restored."
                );
                notify({
                  tone: "success",
                  title: "Admin update saved",
                  message: nextStatus === "SUSPENDED" ? "Creator suspended." : "Creator restored.",
                });
                setPending(null);
              },
              onError: (error) => {
                setActionError(getApiErrorMessage(error));
                notify({
                  tone: "error",
                  title: "Update failed",
                  message: getApiErrorMessage(error),
                });
              },
            }
          );
        }}
      />
    </div>
  );
}
