import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";

export function ClashesSkeleton() {
  return (
    <div>
      <Skeleton className="mb-3 h-8 w-32" />
      <SkeletonText className="mb-6 h-4 w-72" />
      <Skeleton className="mb-4 h-11 w-full max-w-sm rounded-xl" />
      <SkeletonCard className="h-80" />
    </div>
  );
}
