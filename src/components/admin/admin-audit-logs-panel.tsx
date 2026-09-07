"use client";

import { useState } from "react";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/admin-data-table";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminErrorState } from "@/components/admin/admin-error-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AuditLogsSkeleton } from "@/components/admin/audit-logs-skeleton";
import { useAdminAuditLogs } from "@/hooks/queries/use-admin-audit-logs";
import { formatAdminDateTime } from "@/lib/admin-format";
import type { AuditLog } from "@/types/audit-log";

const PAGE_SIZE = 15;

export function AdminAuditLogsPanel() {
  const [page, setPage] = useState(1);
  const query = useAdminAuditLogs({ page, limit: PAGE_SIZE });
  const rows = query.data?.items ?? [];
  const pageCount = Math.max(1, query.data?.pagination.totalPages ?? 1);

  const columns: AdminTableColumn<AuditLog>[] = [
    { id: "action", header: "Action", cell: (row) => row.action.replaceAll("_", " ") },
    { id: "entity", header: "Entity", cell: (row) => `${row.entityType} · ${row.entityId}` },
    { id: "admin", header: "Admin", cell: (row) => row.admin?.name ?? "—" },
    { id: "created", header: "Created", cell: (row) => formatAdminDateTime(row.createdAt) },
  ];

  return (
    <div>
      <AdminPageHeader title="Audit logs" description="Read-only history of admin actions." />
      {query.isPending ? (
        <AuditLogsSkeleton />
      ) : query.isError ? (
        <AdminErrorState error={query.error} onRetry={() => void query.refetch()} />
      ) : (
        <>
          <AdminDataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            empty={<AdminEmptyState title="No audit logs" description="Admin actions will appear here." />}
          />
          <AdminPagination page={page} pageCount={pageCount} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
