import { AdminBadge } from "@/components/admin/admin-badge";
import type { AdminCategoryStatus, AdminPaymentStatus, AdminSupportStatus } from "@/types/admin";
import type { CreatorStatus } from "@/types/admin";
import type { ClashStatus } from "@/types/clash";
import type { ReportStatus } from "@/types/report";

export function CreatorStatusBadge({ status }: { status: CreatorStatus | "active" | "suspended" }) {
  const normalized = status.toUpperCase();
  const tone = normalized === "ACTIVE" ? "success" : normalized === "INACTIVE" ? "neutral" : "danger";
  return <AdminBadge tone={tone}>{status}</AdminBadge>;
}

export function ClashStatusBadge({
  status,
}: {
  status: ClashStatus | "scheduled" | "live" | "ending" | "completed";
}) {
  const normalized = status.toUpperCase();
  const tone =
    normalized === "LIVE" || status === "ending"
      ? "live"
      : normalized === "COMPLETED"
        ? "neutral"
        : normalized === "CANCELLED"
          ? "danger"
          : "warning";
  return <AdminBadge tone={tone}>{normalized === "LIVE" ? "LIVE" : status}</AdminBadge>;
}

export function SupportStatusBadge({ status }: { status: AdminSupportStatus }) {
  const normalized = status.toUpperCase();
  const tone = normalized === "CONFIRMED" || status === "completed" ? "success" : normalized === "PENDING" || status === "pending" ? "warning" : "danger";
  return <AdminBadge tone={tone}>{normalized === "CONFIRMED" ? "confirmed" : normalized.toLowerCase()}</AdminBadge>;
}

export function PaymentStatusBadge({ status }: { status: AdminPaymentStatus }) {
  const normalized = status.toUpperCase();
  const tone =
    normalized === "PAID"
      ? "success"
      : normalized === "PENDING" || normalized === "CREATED"
        ? "warning"
        : normalized === "REFUNDED"
          ? "neutral"
          : "danger";
  return <AdminBadge tone={tone}>{normalized.toLowerCase()}</AdminBadge>;
}

export function ReportStatusBadge({
  status,
}: {
  status: ReportStatus | "pending" | "reviewed" | "resolved" | "rejected";
}) {
  const normalized = status.toUpperCase();
  const tone =
    normalized === "RESOLVED"
      ? "success"
      : normalized === "PENDING"
        ? "warning"
        : normalized === "REJECTED"
          ? "danger"
          : "neutral";
  return <AdminBadge tone={tone}>{status}</AdminBadge>;
}

export function CategoryStatusBadge({ status }: { status: AdminCategoryStatus }) {
  return <AdminBadge tone={status === "active" ? "success" : "neutral"}>{status}</AdminBadge>;
}
