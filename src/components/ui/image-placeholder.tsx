import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label?: string;
  initials?: string;
  className?: string;
  rounded?: "full" | "xl" | "2xl";
}

export function ImagePlaceholder({
  label = "ClashCreators placeholder",
  initials,
  className,
  rounded = "full",
}: ImagePlaceholderProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "flex h-full w-full items-center justify-center bg-primary/12 text-primary",
        rounded === "full" && "rounded-full",
        rounded === "xl" && "rounded-xl",
        rounded === "2xl" && "rounded-2xl",
        className
      )}
    >
      {initials ? (
        <span className="text-[0.65em] font-black tracking-tight">{initials}</span>
      ) : (
        <Crown className="h-[46%] w-[46%]" aria-hidden="true" />
      )}
    </span>
  );
}
