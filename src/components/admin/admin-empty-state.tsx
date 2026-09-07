import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AdminEmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function AdminEmptyState({ title, description, action, className }: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/60 px-6 py-14 text-center",
        className
      )}
    >
      <h3 className="mb-2 text-lg font-bold tracking-tight">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
