import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ApiStatusPanelProps {
  title: string;
  message: string;
  action?: ReactNode;
}

export function ApiStatusPanel({ title, message, action }: ApiStatusPanelProps) {
  return (
    <div className="rounded-2xl border border-dashed border-border/60 px-6 py-16 text-center">
      <h2 className="mb-2 text-xl font-bold tracking-tight">{title}</h2>
      <p className="mb-6 text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}

interface ApiRetryButtonProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export function ApiRetryButton({ onRetry, isRetrying = false }: ApiRetryButtonProps) {
  return (
    <Button onClick={onRetry} disabled={isRetrying} className="font-bold">
      {isRetrying ? "Retrying…" : "Try again"}
    </Button>
  );
}
