import { cn } from "@/lib/utils";

type ClashStatus = "UPCOMING" | "LIVE" | "COMPLETED" | "DRAFT" | "CANCELLED" | string;

const labels: Record<string, string> = {
  UPCOMING: "Upcoming",
  LIVE: "Live",
  COMPLETED: "Completed",
  DRAFT: "Draft",
  CANCELLED: "Cancelled",
};

const aliases: Record<string, string> = {
  SCHEDULED: "UPCOMING",
  ENDING: "LIVE",
};

export function StatusBadge({ status, className }: { status: ClashStatus; className?: string }) {
  const normalized = aliases[status.toUpperCase()] ?? status.toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
        normalized === "LIVE" && "bg-orange-500/15 text-orange-400",
        normalized === "UPCOMING" && "bg-primary/12 text-primary",
        normalized === "COMPLETED" && "bg-emerald-500/12 text-emerald-400",
        normalized === "CANCELLED" && "bg-red-500/12 text-red-400",
        !["LIVE", "UPCOMING", "COMPLETED", "CANCELLED"].includes(normalized) &&
          "bg-secondary text-muted-foreground",
        className
      )}
    >
      {normalized === "LIVE" ? (
        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" aria-hidden="true" />
      ) : null}
      {labels[normalized] ?? status}
    </span>
  );
}
