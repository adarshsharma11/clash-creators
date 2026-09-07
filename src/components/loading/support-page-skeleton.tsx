import { PageLoader } from "@/components/ui/page-loader";
import {
  Skeleton,
  SkeletonButton,
  SkeletonCard,
  SkeletonText,
} from "@/components/ui/skeleton";

export function SupportPageSkeleton() {
  return (
    <PageLoader label="Loading support page">
      <div className="container mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-8">
        <SkeletonText className="mb-8 h-4 w-36" />
        <SkeletonText className="mb-3 h-3 w-40" />
        <Skeleton className="mb-4 h-12 w-full max-w-xl" />
        <SkeletonText className="mb-10 h-5 w-64" />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="space-y-6">
            <SkeletonCard className="h-52" />
            <SkeletonCard className="h-28" />
          </div>
          <div className="space-y-6">
            <SkeletonText className="h-6 w-36" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
              <Skeleton className="h-20 rounded-2xl" />
            </div>
            <SkeletonCard className="h-16" />
            <SkeletonButton className="h-14 w-full" />
          </div>
        </div>
      </div>
    </PageLoader>
  );
}
