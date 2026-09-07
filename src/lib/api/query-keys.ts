import type { AdminClashQuery, AdminCreatorQuery, AdminPaymentQuery, AdminReportQuery, AuditLogQuery } from "@/types/admin";
import type { ClashListQuery } from "@/types/clash";
import type { CreatorListQuery } from "@/types/creator";
import type { WinnerListQuery } from "@/types/winner";

export const queryKeys = {
  categories: {
    all: ["categories"] as const,
    detail: (slug: string) => ["category", slug] as const,
  },
  auth: {
    me: ["auth", "me"] as const,
    user: ["auth", "me"] as const,
  },
  creators: {
    all: ["creators"] as const,
    me: ["creators", "me"] as const,
    list: (query?: CreatorListQuery) => ["creators", "list", query ?? {}] as const,
    detail: (username: string) => ["creator", username] as const,
    clashes: (username: string) => ["creator", username, "clashes"] as const,
    supporters: (username: string) => ["creator", username, "supporters"] as const,
    supports: (username: string) => ["creator", username, "supports"] as const,
    achievements: (username: string) => ["creator", username, "achievements"] as const,
  },
  clashes: {
    all: ["clashes"] as const,
    list: (query?: ClashListQuery) => ["clashes", "list", query ?? {}] as const,
    live: ["clashes", "live"] as const,
    detail: (id: string) => ["clash", id] as const,
    leaderboard: (id: string) => ["clash", id, "leaderboard"] as const,
    winner: (id: string) => ["clash", id, "winner"] as const,
  },
  winners: {
    all: ["winners"] as const,
    list: (query?: WinnerListQuery) => ["winners", "list", query ?? {}] as const,
  },
  homepage: {
    counters: ["homepage", "counters"] as const,
  },
  support: {
    creator: (username: string) => ["support", "creator", username] as const,
    detail: (id: string) => ["support", "detail", id] as const,
  },
  admin: {
    me: ["admin", "me"] as const,
    dashboard: ["admin", "dashboard"] as const,
    creators: {
      all: ["admin", "creators"] as const,
      list: (query?: AdminCreatorQuery) => ["admin", "creators", query ?? {}] as const,
    },
    clashes: {
      all: ["admin", "clashes"] as const,
      list: (query?: AdminClashQuery) => ["admin", "clashes", query ?? {}] as const,
      detail: (id: string) => ["admin", "clashes", id] as const,
    },
    reports: {
      all: ["admin", "reports"] as const,
      list: (query?: AdminReportQuery) => ["admin", "reports", query ?? {}] as const,
    },
    achievements: {
      all: ["admin", "achievements"] as const,
    },
    settings: {
      all: ["admin", "settings"] as const,
    },
    auditLogs: {
      all: ["admin", "audit-logs"] as const,
      list: (query?: AuditLogQuery) => ["admin", "audit-logs", query ?? {}] as const,
    },
    payments: {
      all: ["admin", "payments"] as const,
      list: (query?: AdminPaymentQuery) => ["admin", "payments", query ?? {}] as const,
      detail: (id: string) => ["admin", "payments", id] as const,
    },
    categories: {
      all: ["admin", "categories"] as const,
    },
  },
} as const;
