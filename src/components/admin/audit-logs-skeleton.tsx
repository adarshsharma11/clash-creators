import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";

export function AuditLogsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-3 h-8 w-36" />
      <SkeletonText className="mb-6 h-4 w-64" />
      <SkeletonCard className="h-96" />
    </div>
  );
}
