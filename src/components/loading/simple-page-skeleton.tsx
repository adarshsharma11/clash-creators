import { PageLoader } from "@/components/ui/page-loader";
import { Skeleton, SkeletonCard, SkeletonText } from "@/components/ui/skeleton";

export function SimplePageSkeleton() {
  return (
    <PageLoader label="Loading page">
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
        <SkeletonText className="mb-3 h-3 w-20" />
        <Skeleton className="mb-4 h-12 w-72" />
        <SkeletonText className="mb-10 h-5 w-full max-w-lg" />
        <div className="space-y-4">
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
        </div>
      </div>
    </PageLoader>
  );
}
