"use client";

import { Button } from "@/components/ui/button";

interface AdminPaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function AdminPagination({ page, pageCount, onPageChange }: AdminPaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <p className="px-2 text-xs text-muted-foreground">
        Page {page} of {pageCount}
      </p>
      <Button
        variant="outline"
        size="sm"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
