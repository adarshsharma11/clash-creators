import { CreatorPageSkeleton } from "@/components/loading/creator-page-skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-12 sm:px-8">
      <CreatorPageSkeleton />
    </div>
  );
}
