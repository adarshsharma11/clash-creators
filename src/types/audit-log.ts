export type AuditLog = {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: unknown;
  createdAt: string;
  admin?: {
    id: string;
    name: string;
    email: string;
  } | null;
};
