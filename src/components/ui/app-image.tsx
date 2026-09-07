"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { isUsableImageUrl } from "@/lib/media";
import { cn } from "@/lib/utils";

interface AppImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  imageClassName?: string;
  rounded?: "full" | "xl" | "2xl";
  initials?: string;
  fallbackLabel?: string;
}

export function AppImage({
  src,
  alt,
  className,
  imageClassName,
  rounded = "xl",
  initials,
  fallbackLabel,
}: AppImageProps) {
  const reduceMotion = useReducedMotion();
  const usable = isUsableImageUrl(src);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const showImage = usable && !failed;

  return (
    <span className={cn("relative block overflow-hidden bg-muted", className)}>
      {showImage ? (
        // Remote creator URLs are often unconfigured for next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "h-full w-full object-cover",
            !reduceMotion && "transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
            imageClassName
          )}
        />
      ) : (
        <ImagePlaceholder
          initials={initials}
          label={fallbackLabel ?? alt}
          rounded={rounded}
        />
      )}
    </span>
  );
}
