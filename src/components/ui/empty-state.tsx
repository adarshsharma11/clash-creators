import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ title, message, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed border-border/60 bg-card/20 px-6 py-14 text-center",
        className
      )}
    >
      <h2 className="mb-2 text-xl font-bold tracking-tight">{title}</h2>
      <p className="mx-auto mb-6 max-w-md text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
