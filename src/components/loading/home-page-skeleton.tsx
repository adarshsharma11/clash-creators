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
      <div className="flex flex-col items-center px-4 pb-20 pt-24 sm:px-8 md:pt-32">
        <Skeleton className="mb-8 h-8 w-40 rounded-full" />
        <Skeleton className="mb-4 h-16 w-full max-w-xl sm:h-20" />
        <Skeleton className="mb-10 h-6 w-full max-w-md" />
        <Skeleton className="mb-10 h-28 w-full max-w-xl rounded-3xl" />
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <SkeletonButton className="h-14 w-full sm:flex-1" />
          <SkeletonButton className="h-14 w-full sm:flex-1" />
        </div>
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
