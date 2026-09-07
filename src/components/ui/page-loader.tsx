import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function PageLoader({ label, children, className }: PageLoaderProps) {
  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cn("flex flex-1 flex-col", className)}>
      <span className="sr-only">{label}</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}
