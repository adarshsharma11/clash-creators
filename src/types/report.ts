export type ReportStatus = "PENDING" | "REVIEWED" | "RESOLVED" | "REJECTED";

export type ReportReason =
  | "SPAM"
  | "HARASSMENT"
  | "FAKE_ACCOUNT"
  | "INAPPROPRIATE_CONTENT"
  | "FRAUD"
  | "OTHER";

export type AdminReport = {
  id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  createdAt: string;
  resolvedAt: string | null;
  reporter?: {
    username: string;
    fullName: string;
  } | null;
  creator?: {
    id: string;
    displayName: string;
    user: {
      username: string;
    };
  } | null;
  clash?: {
    id: string;
    title: string;
    slug: string;
  } | null;
  resolvedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type UpdateReportInput = {
  status: Exclude<ReportStatus, "PENDING">;
};

export type CreateReportInput = {
  creatorId?: string;
  clashId?: string;
  reason: ReportReason;
  description?: string;
};

export type CreatedReport = {
  id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  createdAt: string;
};
