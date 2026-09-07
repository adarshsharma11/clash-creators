import type { SocialPlatform } from "@/types/creator";

export type SocialPlatformMeta = {
  label: string;
  formatUrl: (username: string, profileUrl: string | null) => string | null;
};

const PLATFORM_META: Record<SocialPlatform, SocialPlatformMeta> = {
  INSTAGRAM: {
    label: "Instagram",
    formatUrl: (username, profileUrl) => profileUrl ?? `https://instagram.com/${username}`,
  },
  YOUTUBE: {
    label: "YouTube",
    formatUrl: (username, profileUrl) => profileUrl ?? `https://youtube.com/@${username}`,
  },
  TIKTOK: {
    label: "TikTok",
    formatUrl: (username, profileUrl) => profileUrl ?? `https://tiktok.com/@${username}`,
  },
  X: {
    label: "X",
    formatUrl: (username, profileUrl) => profileUrl ?? `https://x.com/${username}`,
  },
  FACEBOOK: {
    label: "Facebook",
    formatUrl: (username, profileUrl) => profileUrl ?? `https://facebook.com/${username}`,
  },
  TWITCH: {
    label: "Twitch",
    formatUrl: (username, profileUrl) => profileUrl ?? `https://twitch.tv/${username}`,
  },
};

export function getSocialPlatformMeta(platform: SocialPlatform): SocialPlatformMeta {
  return PLATFORM_META[platform];
}

export function isSocialPlatform(value: string): value is SocialPlatform {
  return value in PLATFORM_META;
}

export const SOCIAL_PLATFORMS = Object.keys(PLATFORM_META) as SocialPlatform[];
