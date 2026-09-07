export type { AdminRole, AdminSession as AdminUser } from "@/types/auth";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResult<T> = {
  items: T[];
  pagination: PaginationMeta;
};

export type AdminDashboard = {
  totalUsers: number;
  totalCreators: number;
  activeCreators: number;
  liveClashes: number;
  upcomingClashes: number;
  completedClashes: number;
  totalSupports: number;
  totalConfirmedSupportPoints: number;
  totalPayments: number;
  pendingReports: number;
};

export type CreatorStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type AdminCreator = {
  id: string;
  displayName: string;
  bio: string | null;
  status: CreatorStatus;
  createdAt: string;
  user: {
    username: string;
    fullName: string;
    email: string;
    isActive: boolean;
  };
  category: {
    name: string;
    slug: string;
  } | null;
};

export type AdminCreatorQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: CreatorStatus;
  category?: string;
};

export type AdminClashQuery = {
  page?: number;
  limit?: number;
  search?: string;
  status?: import("@/types/clash").ClashStatus;
  category?: string;
};

export type AdminReportQuery = {
  page?: number;
  limit?: number;
  status?: import("@/types/report").ReportStatus;
  reason?: import("@/types/report").ReportReason;
};

export type AuditLogQuery = {
  page?: number;
  limit?: number;
  action?: string;
  entityType?: string;
  entityId?: string;
};

export type AdminCreatorStatus = "active" | "suspended";

export type AdminClashStatus = "scheduled" | "live" | "ending" | "completed";

export type AdminCategoryStatus = "active" | "inactive";

export type AdminSupportStatus =
  | "completed"
  | "pending"
  | "failed"
  | "CONFIRMED"
  | "PENDING"
  | "FAILED"
  | "CANCELLED";

export type AdminPaymentStatus =
  | "paid"
  | "pending"
  | "failed"
  | "refunded"
  | "CREATED"
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export type AdminPaymentQuery = {
  page?: number;
  limit?: number;
  status?: "CREATED" | "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  search?: string;
  from?: string;
  to?: string;
};

export type AdminPayment = {
  id: string;
  provider: string;
  amount: string | number;
  currency: string;
  status: AdminPaymentStatus;
  razorpayOrderId: string | null;
  providerPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
  support: {
    id: string;
    points: number;
    status: string;
    supporter: {
      id: string;
      username: string;
      fullName: string;
      email: string;
    } | null;
    creator: {
      id: string;
      displayName: string;
      user: {
        username: string;
      };
    } | null;
    clash: {
      id: string;
      title: string;
      slug: string;
      status: string;
    } | null;
  } | null;
};

export type AdminReportStatus = "pending" | "reviewed" | "resolved" | "rejected";

export type AdminActivity = {
  id: string;
  type: string;
  message: string;
  timestamp: string;
};

export type AdminDashboardStats = {
  totalCreators: number;
  activeClashes: number;
  todaySupportPoints: number;
  todaySupports: number;
};

export type AdminCreatorRow = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  category: string;
  currentRank: number | null;
  supportPoints: number;
  status: AdminCreatorStatus;
  joinedAt: string;
};

export type AdminClashRow = {
  id: string;
  title: string;
  status: AdminClashStatus;
  creatorCount: number;
  startsAt: string;
  endsAt: string;
  topCreatorUsername: string | null;
  topCreatorName: string | null;
};

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  creatorCount: number;
  activeClash: string | null;
  topCreatorName: string | null;
  status: AdminCategoryStatus;
};

export type AdminSupportRow = {
  id: string;
  creatorUsername: string;
  creatorName: string;
  clashTitle: string;
  points: number;
  status: AdminSupportStatus;
  createdAt: string;
};

export type AdminPaymentRow = {
  id: string;
  creatorUsername: string;
  creatorName: string;
  amount: number;
  currency: string;
  status: AdminPaymentStatus;
  provider: string;
  createdAt: string;
};

export type AdminReportRow = {
  id: string;
  creatorUsername: string;
  creatorName: string;
  reason: string;
  reporter: string;
  status: AdminReportStatus;
  createdAt: string;
};

export type AdminSettings = {
  siteName: string;
  defaultSupportPoints: number;
  minimumSupportPoints: number;
  clashDurationHours: number;
  maintenanceMode: boolean;
};
