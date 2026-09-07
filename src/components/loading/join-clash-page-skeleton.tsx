import { PageLoader } from "@/components/ui/page-loader";
import {
  Skeleton,
  SkeletonButton,
  SkeletonCard,
  SkeletonText,
} from "@/components/ui/skeleton";

export function JoinClashPageSkeleton() {
  return (
    <PageLoader label="Loading join clash">
      <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-16">
        <div className="mb-10 text-center">
          <Skeleton className="mx-auto mb-4 h-7 w-28 rounded-full" />
          <Skeleton className="mx-auto mb-4 h-12 w-full max-w-md" />
          <SkeletonText className="mx-auto h-5 w-72" />
          <SkeletonButton className="mx-auto mt-6 h-12 w-44" />
        </div>

        <div className="mb-8 flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-px flex-1" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        <SkeletonCard className="h-80 rounded-3xl" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <SkeletonButton className="h-12 w-full sm:w-28" />
          <SkeletonButton className="h-12 w-full sm:w-36" />
        </div>
      </div>
    </PageLoader>
  );
}
