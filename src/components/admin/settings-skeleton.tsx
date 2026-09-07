import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
  return (
    <div>
      <Skeleton className="mb-3 h-8 w-32" />
      <SkeletonText className="mb-6 h-4 w-72" />
      <div className="space-y-4">
        <SkeletonCard className="h-40" />
        <SkeletonCard className="h-40" />
      </div>
    </div>
  );
}
