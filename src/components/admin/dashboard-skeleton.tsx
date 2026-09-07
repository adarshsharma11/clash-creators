import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div>
      <Skeleton className="mb-3 h-8 w-40" />
      <SkeletonText className="mb-6 h-4 w-72" />
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
        <SkeletonCard className="h-24" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <SkeletonCard className="h-64" />
        <SkeletonCard className="h-64" />
      </div>
    </div>
  );
}
