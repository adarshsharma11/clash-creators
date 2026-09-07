import { PageLoader } from "@/components/ui/page-loader";
import {
  Skeleton,
  SkeletonButton,
  SkeletonCard,
  SkeletonLeaderboardRow,
  SkeletonText,
} from "@/components/ui/skeleton";

export function ClashPageSkeleton() {
  return (
    <PageLoader label="Loading clash">
      <div className="container mx-auto px-4 py-4 sm:px-8">
        <SkeletonText className="h-4 w-28" />
      </div>

      <div className="border-b border-border/40 px-4 pb-16 pt-10 sm:px-8 md:pb-24 md:pt-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <Skeleton className="mb-6 h-7 w-28 rounded-full" />
          <Skeleton className="mb-4 h-14 w-full max-w-lg sm:h-16" />
          <Skeleton className="mb-12 h-6 w-full max-w-md" />
          <SkeletonCard className="h-36 max-w-3xl rounded-3xl" />
          <SkeletonButton className="mt-8 h-11 w-32" />
        </div>
      </div>

      <div className="container mx-auto max-w-5xl space-y-4 px-4 py-12 sm:px-8">
        <SkeletonLeaderboardRow />
        <SkeletonLeaderboardRow />
        <SkeletonLeaderboardRow />
      </div>
    </PageLoader>
  );
}
