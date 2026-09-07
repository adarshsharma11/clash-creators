import { cn } from "@/lib/utils";

interface AdminBadgeProps {
  tone?: "neutral" | "success" | "warning" | "danger" | "live";
  children: string;
  className?: string;
}

const TONE_CLASS: Record<NonNullable<AdminBadgeProps["tone"]>, string> = {
  neutral: "border-border/60 bg-secondary/60 text-muted-foreground",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  danger: "border-red-500/30 bg-red-500/10 text-red-300",
  live: "border-orange-500/30 bg-orange-500/10 text-orange-300",
};

export function AdminBadge({ tone = "neutral", children, className }: AdminBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        TONE_CLASS[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
