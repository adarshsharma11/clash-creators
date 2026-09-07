import Link from "next/link";
import type { CategoryListItem } from "@/lib/category-rankings";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatPoints } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface CategoryRankRowProps {
  item: CategoryListItem;
  position: number;
  metric: "support" | "followers";
}

export function CategoryRankRow({ item, position }: CategoryRankRowProps) {
  const isLeader = position === 1;

  return (
    <li>
      <Link
        href={`/creators/${item.username}`}
        className={cn(
          "group flex items-start gap-4 rounded-2xl border px-4 py-4 transition-colors sm:items-center sm:px-5",
          isLeader
            ? "border-primary/20 bg-primary/[0.06]"
            : "border-border/50 bg-card/40 hover:border-primary/30"
        )}
      >
        <div
          className={cn(
            "w-10 shrink-0 font-mono text-xl font-black sm:text-2xl",
            isLeader ? "text-primary" : "text-muted-foreground"
          )}
        >
          #{position}
        </div>

        <Avatar
          src={item.avatarUrl}
          alt={item.displayName}
          className="h-12 w-12 sm:h-14 sm:w-14"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-bold group-hover:text-primary">{item.displayName}</span>
            {item.verified ? (
              <Badge
                variant="secondary"
                className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 p-0 text-[10px] text-white"
              >
                ✓
              </Badge>
            ) : null}
          </div>
          <p className="truncate text-sm text-muted-foreground">@{item.username}</p>
          {item.clashRank ? (
            <p className="mt-1 text-xs text-muted-foreground">
              #{item.clashRank} in today&apos;s Clash
            </p>
          ) : null}
        </div>

        <div className="text-right">
          <div className="font-mono text-base font-bold text-primary sm:text-lg">
            {formatPoints(item.supportPoints ?? 0)}
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Support
          </div>
        </div>
      </Link>
    </li>
  );
}
