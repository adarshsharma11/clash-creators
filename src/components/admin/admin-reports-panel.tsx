"use client";

import { useState } from "react";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/admin-data-table";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminErrorState } from "@/components/admin/admin-error-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { ReportStatusBadge } from "@/components/admin/admin-status-badges";
import { ReportsSkeleton } from "@/components/admin/reports-skeleton";
import { Button } from "@/components/ui/button";
import { useUpdateReport } from "@/hooks/mutations/use-admin-update-report";
import { useAdminReports } from "@/hooks/queries/use-admin-reports";
import { formatAdminDateTime } from "@/lib/admin-format";
import { getApiErrorMessage } from "@/types/api";
import type { AdminReport, ReportStatus } from "@/types/report";

const PAGE_SIZE = 10;

export function AdminReportsPanel() {
  const [page, setPage] = useState(1);
  const [pending, setPending] = useState<{ row: AdminReport; next: Exclude<ReportStatus, "PENDING"> } | null>(
    null
  );
  const [feedback, setFeedback] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const updateReport = useUpdateReport();
  const query = useAdminReports({ page, limit: PAGE_SIZE });

  const rows = query.data?.items ?? [];
  const pageCount = Math.max(1, query.data?.pagination.totalPages ?? 1);

  const columns: AdminTableColumn<AdminReport>[] = [
    {
      id: "creator",
      header: "Reported Creator",
      cell: (row) => (
        <div>
          <p className="font-semibold">{row.creator?.displayName ?? "—"}</p>
          <p className="text-xs text-muted-foreground">
            {row.creator ? `@${row.creator.user.username}` : "No creator"}
          </p>
        </div>
      ),
    },
    { id: "reason", header: "Reason", cell: (row) => row.reason.replaceAll("_", " ") },
    { id: "reporter", header: "Reporter", cell: (row) => row.reporter?.username ?? "—" },
    { id: "status", header: "Status", cell: (row) => <ReportStatusBadge status={row.status} /> },
    { id: "created", header: "Created", cell: (row) => formatAdminDateTime(row.createdAt) },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => setPending({ row, next: "REVIEWED" })}>
            Review
          </Button>
          <Button size="sm" variant="outline" onClick={() => setPending({ row, next: "RESOLVED" })}>
            Resolve
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setPending({ row, next: "REJECTED" })}>
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Reports" description="Review and resolve creator reports." />
      {feedback ? <p className="mb-3 text-sm text-primary">{feedback}</p> : null}
      {actionError ? <p className="mb-3 text-sm text-red-400">{actionError}</p> : null}
      {query.isPending ? (
        <ReportsSkeleton />
      ) : query.isError ? (
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <>
          <AdminDataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            empty={<AdminEmptyState title="No reports found" description="The moderation queue is empty." />}
          />
          <AdminPagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </>
      )}

      <AdminConfirmDialog
        open={pending !== null}
        title={
          pending?.next === "REJECTED"
            ? "Reject report?"
            : pending?.next === "RESOLVED"
              ? "Resolve report?"
              : "Mark as reviewed?"
        }
        description={
          pending
            ? `This updates the report for ${pending.row.creator?.displayName ?? "this creator"}.`
            : ""
        }
        confirmLabel={
          pending?.next === "REJECTED" ? "Reject" : pending?.next === "RESOLVED" ? "Resolve" : "Review"
        }
        tone={pending?.next === "REJECTED" ? "danger" : "default"}
        confirming={updateReport.isPending}
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending || updateReport.isPending) {
            return;
          }
          setActionError(null);
          updateReport.mutate(
            { id: pending.row.id, input: { status: pending.next } },
            {
              onSuccess: () => {
                setFeedback("Report updated.");
                setPending(null);
              },
              onError: (error) => {
                setActionError(getApiErrorMessage(error));
              },
            }
          );
        }}
      />
    </div>
  );
}
