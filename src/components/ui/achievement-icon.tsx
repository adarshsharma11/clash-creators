import { createElement } from "react";
import { Lock } from "lucide-react";
import { resolveAchievementIcon } from "@/lib/brand-icons";
import { cn } from "@/lib/utils";

interface AchievementIconProps {
  icon?: string | null;
  slug?: string | null;
  title?: string | null;
  unlocked?: boolean;
  className?: string;
}

export function AchievementIcon({
  icon,
  slug,
  title,
  unlocked = true,
  className,
}: AchievementIconProps) {
  return createElement(unlocked ? resolveAchievementIcon(icon, slug, title) : Lock, {
    className: cn("h-7 w-7", className),
    "aria-hidden": true,
  });
}
