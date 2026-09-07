import { PageLoader } from "@/components/ui/page-loader";
import {
  Skeleton,
  SkeletonButton,
  SkeletonLeaderboardRow,
  SkeletonText,
} from "@/components/ui/skeleton";

export function HomePageSkeleton() {
  return (
    <PageLoader label="Loading ClashCreators">
      <div className="container mx-auto grid gap-10 px-4 pb-16 pt-16 sm:px-8 md:pt-20 lg:grid-cols-[1.15fr_22rem]">
        <div>
          <Skeleton className="mb-5 h-4 w-28 rounded-full" />
          <Skeleton className="mb-3 h-12 w-full max-w-md" />
          <Skeleton className="mb-6 h-12 w-full max-w-sm" />
          <SkeletonText className="mb-8 h-5 w-72" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <SkeletonButton className="h-12 w-full sm:w-48" />
            <SkeletonButton className="h-12 w-full sm:w-40" />
          </div>
        </div>
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>

      <div className="container mx-auto max-w-5xl space-y-6 px-4 pb-16 sm:px-8">
        <SkeletonText className="h-8 w-56" />
        <SkeletonLeaderboardRow />
        <SkeletonLeaderboardRow />
        <SkeletonLeaderboardRow />
      </div>
    </PageLoader>
  );
}
