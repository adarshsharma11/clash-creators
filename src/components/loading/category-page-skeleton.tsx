import { PageLoader } from "@/components/ui/page-loader";
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonText,
} from "@/components/ui/skeleton";

interface CategoryPageSkeletonProps {
  variant?: "index" | "detail";
}

export function CategoryPageSkeleton({ variant = "index" }: CategoryPageSkeletonProps) {
  const label = variant === "detail" ? "Loading category" : "Loading categories";

  return (
    <PageLoader label={label}>
      {variant === "detail" ? <CategoryDetailSkeleton /> : <CategoryIndexSkeleton />}
    </PageLoader>
  );
}

function CategoryIndexSkeleton() {
  return (
    <div className="pb-16">
      <div className="mb-10 max-w-2xl space-y-3">
        <Skeleton className="h-12 w-56" />
        <SkeletonText className="h-5 w-full max-w-md" />
      </div>
      <SkeletonCard className="mb-12 h-64 rounded-[1.75rem]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <SkeletonCard className="h-56" />
        <SkeletonCard className="h-56" />
        <SkeletonCard className="h-56" />
      </div>
    </div>
  );
}

function CategoryDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-16">
      <div className="flex justify-center">
        <Skeleton className="h-11 w-52 rounded-full" />
      </div>
      <div className="flex flex-col items-center text-center">
        <Skeleton className="mb-4 h-14 w-14 rounded-2xl" />
        <Skeleton className="mb-3 h-12 w-48" />
        <SkeletonText className="h-5 w-64" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/40 p-4"
          >
            <SkeletonText className="h-4 w-6" />
            <SkeletonAvatar className="h-10 w-10" />
            <div className="min-w-0 flex-1 space-y-2">
              <SkeletonText className="h-4 w-32" />
              <SkeletonText className="h-3 w-20" />
            </div>
            <SkeletonText className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
