import { Button } from "@/components/ui/button";
import { getPermissionErrorMessage } from "@/types/api";

interface AdminErrorStateProps {
  error?: unknown;
  onRetry?: () => void;
}

export function AdminErrorState({ error, onRetry }: AdminErrorStateProps) {
  return (
    <div className="rounded-2xl border border-border/50 px-6 py-14 text-center">
      <h3 className="mb-2 text-lg font-bold">Something went wrong.</h3>
      <p className="mb-6 text-sm text-muted-foreground">{getPermissionErrorMessage(error)}</p>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
