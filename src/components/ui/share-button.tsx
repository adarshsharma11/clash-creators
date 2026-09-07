"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { copyText, shareOrCopy, toAbsoluteUrl } from "@/lib/share";
import { Check, Link2, Share2 } from "lucide-react";

interface ShareButtonProps {
  url?: string;
  title?: string;
  text?: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
  label?: string;
  copiedLabel?: string;
  copyOnly?: boolean;
}

export function ShareButton({
  url,
  title = "Check this out!",
  text = "Support this creator on ClashCreators",
  variant = "outline",
  size = "default",
  className,
  showText = true,
  label,
  copiedLabel = "Copied!",
  copyOnly = false,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = toAbsoluteUrl(url || window.location.href);

    if (copyOnly) {
      const didCopy = await copyText(shareUrl);
      if (didCopy) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
      return;
    }

    const outcome = await shareOrCopy({
      url: shareUrl,
      title,
      text,
    });

    if (outcome === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const Icon = copyOnly ? Link2 : Share2;

  return (
    <Button variant={variant} size={size} onClick={handleShare} className={className}>
      {copied ? (
        <Check className="mr-2 h-4 w-4 text-green-500" />
      ) : (
        <Icon className="mr-2 h-4 w-4" />
      )}
      {showText && (copied ? copiedLabel : label ?? (copyOnly ? "Copy Link" : "Share"))}
    </Button>
  );
}
