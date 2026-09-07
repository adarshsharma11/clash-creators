"use client";

import { useMemo, useState } from "react";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/admin-data-table";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminErrorState } from "@/components/admin/admin-error-state";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { PaymentStatusBadge } from "@/components/admin/admin-status-badges";
import { useAdminPayments } from "@/hooks/queries/use-admin-payments";
import { formatAdminDateTime } from "@/lib/admin-format";
import { formatPoints } from "@/lib/formatters";
import type { AdminPayment } from "@/types/admin";

function amountValue(amount: string | number): number {
  const value = typeof amount === "number" ? amount : Number(amount);
  return Number.isFinite(value) ? value : 0;
}

export function AdminPaymentsPanel() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const paymentsQuery = useAdminPayments({ page, limit: 20, search: query || undefined });
  const rows = useMemo(() => paymentsQuery.data?.items ?? [], [paymentsQuery.data?.items]);
  const pagination = paymentsQuery.data?.pagination;

  const totals = useMemo(() => {
    const statuses = rows.map((row) => String(row.status).toUpperCase());
    return {
      total: pagination?.total ?? rows.length,
      successful: statuses.filter((status) => status === "PAID").length,
      pending: statuses.filter((status) => status === "PENDING" || status === "CREATED").length,
      failed: statuses.filter((status) => status === "FAILED").length,
    };
  }, [pagination?.total, rows]);

  const columns: AdminTableColumn<AdminPayment>[] = [
    { id: "id", header: "Payment ID", cell: (row) => <span className="font-mono text-xs">{row.id}</span>, hideOnMobile: true },
    {
      id: "creator",
      header: "Creator",
      cell: (row) => row.support?.creator?.displayName ?? "—",
    },
    {
      id: "amount",
      header: "Amount",
      cell: (row) => `${formatPoints(amountValue(row.amount))} ${row.currency}`,
    },
    { id: "status", header: "Status", cell: (row) => <PaymentStatusBadge status={row.status} /> },
    { id: "provider", header: "Provider", cell: (row) => row.provider, hideOnMobile: true },
    { id: "created", header: "Created", cell: (row) => formatAdminDateTime(row.createdAt) },
  ];

  return (
    <div>
      <AdminPageHeader title="Payments" description="Razorpay payment records from the backend." />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total" value={totals.total} />
        <AdminStatCard label="Successful" value={totals.successful} />
        <AdminStatCard label="Pending" value={totals.pending} />
        <AdminStatCard label="Failed" value={totals.failed} />
      </div>
      <AdminFilterBar>
        <AdminSearch
          id="admin-payments-search"
          label="Search payments"
          value={query}
          placeholder="Search order id, payment id, or username"
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />
      </AdminFilterBar>
      {paymentsQuery.isError ? (
        <AdminErrorState error={paymentsQuery.error} onRetry={() => void paymentsQuery.refetch()} />
      ) : (
        <>
          <AdminDataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            empty={<AdminEmptyState title="No payments found" description="No payments match this search." />}
          />
          {pagination ? (
            <AdminPagination page={pagination.page} pageCount={pagination.totalPages} onPageChange={setPage} />
          ) : null}
        </>
      )}
    </div>
  );
}
