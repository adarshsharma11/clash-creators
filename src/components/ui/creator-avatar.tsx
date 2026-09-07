"use client";

import { AppImage } from "@/components/ui/app-image";
import { creatorInitials } from "@/lib/media";
import { cn } from "@/lib/utils";

interface CreatorAvatarProps {
  src?: string | null;
  name?: string | null;
  username?: string | null;
  className?: string;
  alt?: string;
}

export function CreatorAvatar({ src, name, username, className, alt }: CreatorAvatarProps) {
  const initials = creatorInitials(name, username);
  const label = alt ?? name ?? username ?? "Creator";

  return (
    <AppImage
      src={src}
      alt={label}
      initials={initials}
      fallbackLabel={`${label} avatar`}
      rounded="full"
      className={cn("h-10 w-10 shrink-0 rounded-full", className)}
    />
  );
}
