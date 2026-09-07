import { PageLoader } from "@/components/ui/page-loader";
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonText,
} from "@/components/ui/skeleton";

export function CreatorPageSkeleton() {
  return (
    <PageLoader label="Loading creator profile">
      <div className="border-b border-border/40 px-4 pb-20 pt-12 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <SkeletonAvatar className="mb-6 h-32 w-32 md:h-40 md:w-40" />
          <SkeletonText className="mb-3 h-3 w-28" />
          <Skeleton className="mb-4 h-12 w-64 sm:w-80" />
          <div className="mb-8 flex gap-3">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <SkeletonButton className="h-14 w-full sm:flex-1" />
            <SkeletonButton className="h-14 w-full sm:flex-1" />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl space-y-8 px-4 py-12 sm:px-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
        </div>
        <SkeletonCard className="h-48" />
        <div className="space-y-4">
          <SkeletonText className="h-6 w-40" />
          <SkeletonCard className="h-20" />
          <SkeletonCard className="h-20" />
        </div>
      </div>
    </PageLoader>
  );
}
