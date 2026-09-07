import { createElement, type JSX } from "react";
import type { SocialPlatform } from "@/types/creator";

function InstagramMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23 12.2s-.2-4.3-1-5.2c-.9-1-2.5-1-3.1-1.1C15.7 5.6 12 5.6 12 5.6h0s-3.7 0-6.9.3c-.6.1-2.2.1-3.1 1.1-.8.9-1 5.2-1 5.2S1 16.5 1.8 17.4c.9 1 2.6 1 3.3 1.1 2.4.2 6.9.3 6.9.3s3.7 0 6.9-.3c.7-.1 2.4-.1 3.3-1.1.8-.9 1-5.2 1-5.2zM9.8 15.5V8.9l6.3 3.3-6.3 3.3z" />
    </svg>
  );
}

function XMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.726-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M14.5 3.2c.8 1.8 2.4 3.1 4.4 3.4v3.1c-1.6 0-3.1-.5-4.3-1.4v7.4c0 3.5-2.8 6.3-6.3 6.3S1.9 19.2 1.9 15.7c0-3.4 2.7-6.2 6.1-6.3v3.2c-1.6.1-2.9 1.5-2.9 3.1 0 1.8 1.4 3.2 3.2 3.2s3.2-1.4 3.2-3.2V3.2h3z" />
    </svg>
  );
}

function FacebookMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
    </svg>
  );
}

function TwitchMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M4.3 2 3 6.2v13.3h4.6V22h2.5l2.4-2.5h3.7L21 15.2V2H4.3zm15.2 12.3-2.5 2.5h-3.7l-2.4 2.5v-2.5H6.4V3.5h13.1v10.8zM16.8 7h-1.8v5.3h1.8V7zm-4.6 0H10.3v5.3h1.9V7z" />
    </svg>
  );
}

const PLATFORM_ICONS: Record<SocialPlatform, (props: { className?: string }) => JSX.Element> = {
  INSTAGRAM: InstagramMark,
  YOUTUBE: YouTubeMark,
  TIKTOK: TikTokMark,
  X: XMark,
  FACEBOOK: FacebookMark,
  TWITCH: TwitchMark,
};

export function SocialPlatformIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  return createElement(PLATFORM_ICONS[platform], { className });
}
