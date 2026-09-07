import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn("skeleton-surface rounded-md", className)} />;
}

export function SkeletonText({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-40", className)} />;
}

export function SkeletonAvatar({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-12 w-12 rounded-full", className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-40 w-full rounded-2xl", className)} />;
}

export function SkeletonButton({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-11 w-36 rounded-md", className)} />;
}

export function SkeletonLeaderboardRow({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border/40 bg-card/40 p-4 sm:flex-row sm:items-center",
        className
      )}
    >
      <Skeleton className="h-7 w-10" />
      <SkeletonAvatar className="h-12 w-12" />
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonText className="h-4 w-36" />
        <SkeletonText className="h-3 w-24" />
      </div>
      <div className="flex w-full items-center gap-3 sm:w-auto sm:flex-col sm:items-end">
        <SkeletonText className="h-5 w-20" />
        <Skeleton className="h-2 w-full rounded-full sm:w-40" />
      </div>
    </div>
  );
}
