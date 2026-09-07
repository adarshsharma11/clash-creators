import { CreatorAvatar } from "@/components/ui/creator-avatar";
import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  className?: string;
}

export function Avatar({ src, alt, fallback, className }: AvatarProps) {
  return (
    <CreatorAvatar
      src={src}
      name={fallback ?? alt}
      alt={alt ?? fallback ?? "Creator"}
      className={cn("h-10 w-10", className)}
    />
  );
}
