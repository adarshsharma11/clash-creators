"use client";

import Link from "next/link";
import { AdminErrorState } from "@/components/admin/admin-error-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { ClashStatusBadge } from "@/components/admin/admin-status-badges";
import { DashboardSkeleton } from "@/components/admin/dashboard-skeleton";
import { Button } from "@/components/ui/button";
import { useAdminAuditLogs } from "@/hooks/queries/use-admin-audit-logs";
import { useAdminClashes } from "@/hooks/queries/use-admin-clashes";
import { useAdminDashboard } from "@/hooks/queries/use-admin-dashboard";
import { formatAdminDateTime } from "@/lib/admin-format";

export function AdminDashboardView() {
  const dashboard = useAdminDashboard();
  const activity = useAdminAuditLogs({ page: 1, limit: 5 });
  const liveClashes = useAdminClashes({ page: 1, limit: 5, status: "LIVE" });

  if (dashboard.isPending) {
    return <DashboardSkeleton />;
  }

  if (dashboard.isError || !dashboard.data) {
    return <AdminErrorState error={dashboard.error} onRetry={() => void dashboard.refetch()} />;
  }

  const stats = dashboard.data;
  const logs = activity.data?.items ?? [];
  const clashes = liveClashes.data?.items ?? [];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Live platform totals from the ClashCreators API."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Total Creators" value={stats.totalCreators} hint={`${stats.activeCreators} active`} />
        <AdminStatCard label="Live Clashes" value={stats.liveClashes} hint={`${stats.upcomingClashes} upcoming`} />
        <AdminStatCard
          label="Confirmed Support Points"
          value={stats.totalConfirmedSupportPoints}
          hint={`${stats.totalSupports} supports`}
        />
        <AdminStatCard label="Pending Reports" value={stats.pendingReports} hint={`${stats.totalUsers} users`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-border/50 p-4">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Recent Activity
          </h2>
          {activity.isError ? (
            <AdminErrorState error={activity.error} onRetry={() => void activity.refetch()} />
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No audit events yet.</p>
          ) : (
            <ul className="space-y-3">
              {logs.map((item) => (
                <li key={item.id} className="border-b border-border/40 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm">
                    {item.action.replaceAll("_", " ")} · {item.entityType}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.admin?.name ?? "Admin"} · {formatAdminDateTime(item.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-border/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Platform snapshot
            </h2>
            <Button asChild variant="link" size="sm">
              <Link href="/admin/creators">View creators</Link>
            </Button>
          </div>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between gap-3">
              <span className="text-muted-foreground">Completed clashes</span>
              <span className="font-semibold">{stats.completedClashes}</span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-muted-foreground">Payments</span>
              <span className="font-semibold">{stats.totalPayments}</span>
            </li>
            <li className="flex justify-between gap-3">
              <span className="text-muted-foreground">Active creators</span>
              <span className="font-semibold">{stats.activeCreators}</span>
            </li>
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-border/50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Live Clashes
          </h2>
          <Button asChild variant="link" size="sm">
            <Link href="/admin/clashes">View Clash</Link>
          </Button>
        </div>
        {liveClashes.isError ? (
          <AdminErrorState error={liveClashes.error} onRetry={() => void liveClashes.refetch()} />
        ) : clashes.length === 0 ? (
          <p className="text-sm text-muted-foreground">No live clashes right now.</p>
        ) : (
          <ul className="space-y-3">
            {clashes.map((clash) => (
              <li
                key={clash.id}
                className="flex flex-col gap-2 border-b border-border/40 pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{clash.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {clash._count?.participants ?? 0} creators · ends {formatAdminDateTime(clash.endsAt)}
                  </p>
                </div>
                <ClashStatusBadge status={clash.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
