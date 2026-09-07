import type { ReactNode } from "react";

export function AdminFilterBar({ children }: { children: ReactNode }) {
  return <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">{children}</div>;
}
