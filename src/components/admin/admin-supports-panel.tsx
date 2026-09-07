"use client";

import { useMemo, useState } from "react";
import { AdminDataTable, type AdminTableColumn } from "@/components/admin/admin-data-table";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminErrorState } from "@/components/admin/admin-error-state";
import { AdminFilterBar } from "@/components/admin/admin-filter-bar";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { SupportStatusBadge } from "@/components/admin/admin-status-badges";
import { Button } from "@/components/ui/button";
import { useAdminPayments } from "@/hooks/queries/use-admin-payments";
import { formatAdminDateTime } from "@/lib/admin-format";
import { formatPoints } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { AdminSupportStatus } from "@/types/admin";

const FILTERS: { id: "all" | "CONFIRMED" | "PENDING" | "FAILED"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "CONFIRMED", label: "Confirmed" },
  { id: "PENDING", label: "Pending" },
  { id: "FAILED", label: "Failed" },
];

type SupportRow = {
  id: string;
  creatorUsername: string;
  creatorName: string;
  clashTitle: string;
  points: number;
  status: AdminSupportStatus;
  createdAt: string;
};

function mapSupportStatus(status: string): AdminSupportStatus {
  const normalized = status.toUpperCase();
  if (normalized === "CONFIRMED") {
    return "CONFIRMED";
  }
  if (normalized === "FAILED" || normalized === "CANCELLED") {
    return "FAILED";
  }
  return "PENDING";
}

export function AdminSupportsPanel() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "CONFIRMED" | "PENDING" | "FAILED">("all");
  const [page, setPage] = useState(1);
  const paymentsQuery = useAdminPayments({ page, limit: 20, search: query || undefined });

  const rows: SupportRow[] = useMemo(() => {
    return (paymentsQuery.data?.items ?? [])
      .filter((payment) => payment.support)
      .map((payment) => ({
        id: payment.support!.id,
        creatorUsername: payment.support!.creator?.user.username ?? "—",
        creatorName: payment.support!.creator?.displayName ?? "—",
        clashTitle: payment.support!.clash?.title ?? "—",
        points: payment.support!.points,
        status: mapSupportStatus(payment.support!.status),
        createdAt: payment.createdAt,
      }))
      .filter((row) => status === "all" || row.status === status);
  }, [paymentsQuery.data?.items, status]);

  const columns: AdminTableColumn<SupportRow>[] = [
    { id: "id", header: "Transaction", cell: (row) => <span className="font-mono text-xs">{row.id}</span> },
    {
      id: "creator",
      header: "Creator",
      cell: (row) => (
        <div>
          <p>{row.creatorName}</p>
          <p className="text-xs text-muted-foreground">@{row.creatorUsername}</p>
        </div>
      ),
    },
    { id: "clash", header: "Clash", cell: (row) => row.clashTitle },
    { id: "points", header: "Points", cell: (row) => formatPoints(row.points) },
    { id: "status", header: "Status", cell: (row) => <SupportStatusBadge status={row.status} /> },
    { id: "date", header: "Date", cell: (row) => formatAdminDateTime(row.createdAt) },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Supports"
        description="Support records from payment data. Confirmed points come from the backend only."
      />
      <AdminFilterBar>
        <AdminSearch
          id="admin-supports-search"
          label="Search supports"
          value={query}
          placeholder="Search creator, clash, or payment"
          onChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <Button
              key={filter.id}
              size="sm"
              variant={status === filter.id ? "default" : "outline"}
              className={cn(status === filter.id && "bg-primary text-primary-foreground")}
              onClick={() => setStatus(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </AdminFilterBar>
      {paymentsQuery.isError ? (
        <AdminErrorState error={paymentsQuery.error} onRetry={() => void paymentsQuery.refetch()} />
      ) : (
        <>
          <AdminDataTable
            columns={columns}
            rows={rows}
            rowKey={(row) => row.id}
            empty={<AdminEmptyState title="No support transactions yet" description="No supports match this filter." />}
          />
          {paymentsQuery.data?.pagination ? (
            <AdminPagination
              page={paymentsQuery.data.pagination.page}
              pageCount={paymentsQuery.data.pagination.totalPages}
              onPageChange={setPage}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
