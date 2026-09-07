import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";

export function ReportsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-3 h-8 w-28" />
      <SkeletonText className="mb-6 h-4 w-64" />
      <SkeletonCard className="h-80" />
    </div>
  );
}
