import { PageLoader } from "@/components/ui/page-loader";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

export default function AdminLoginLoading() {
  return (
    <PageLoader label="Loading admin login">
      <div className="flex min-h-screen items-center justify-center p-6">
        <SkeletonCard className="h-96 w-full max-w-md rounded-3xl" />
        <Skeleton className="hidden" />
      </div>
    </PageLoader>
  );
}
