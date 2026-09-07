import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: number;
  hint?: string;
  className?: string;
}

export function AdminStatCard({ label, value, hint, className }: AdminStatCardProps) {
  return (
    <article className={cn("rounded-2xl border border-border/50 bg-card/50 p-4", className)}>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-foreground">{formatNumber(value)}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </article>
  );
}
