import {
  BookOpen,
  Clapperboard,
  Cpu,
  Crown,
  Dumbbell,
  Flame,
  Gamepad2,
  Gem,
  Hash,
  Heart,
  Medal,
  Music,
  Shirt,
  Smile,
  Sparkles,
  Star,
  Trophy,
  Utensils,
  Zap,
  type LucideIcon,
} from "lucide-react";

function normalizeIconKey(value?: string | null): string {
  return (value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  book: BookOpen,
  bookopen: BookOpen,
  education: BookOpen,
  learning: BookOpen,
  clapperboard: Clapperboard,
  entertainment: Clapperboard,
  film: Clapperboard,
  cpu: Cpu,
  technology: Cpu,
  tech: Cpu,
  ai: Cpu,
  crown: Crown,
  dumbbell: Dumbbell,
  fitness: Dumbbell,
  gamepad: Gamepad2,
  gamepad2: Gamepad2,
  gaming: Gamepad2,
  games: Gamepad2,
  music: Music,
  shirt: Shirt,
  fashion: Shirt,
  smile: Smile,
  comedy: Smile,
  sparkles: Sparkles,
  lifestyle: Sparkles,
  beauty: Sparkles,
  utensils: Utensils,
  food: Utensils,
};

const ACHIEVEMENT_ICONS: Record<string, LucideIcon> = {
  trophy: Trophy,
  firstwin: Trophy,
  firstcrown: Trophy,
  star: Star,
  topcreator: Star,
  medal: Medal,
  threewins: Medal,
  crown: Crown,
  tenwins: Crown,
  tendaychampion: Crown,
  heart: Heart,
  topsupporter: Heart,
  flame: Flame,
  fire: Flame,
  threedaystreak: Flame,
  zap: Zap,
  lightning: Zap,
  fastclimber: Zap,
  gem: Gem,
  diamond: Gem,
  "10ksupport": Gem,
};

export function resolveCategoryIcon(icon?: string | null, slug?: string | null, name?: string | null): LucideIcon {
  return (
    CATEGORY_ICONS[normalizeIconKey(icon)] ??
    CATEGORY_ICONS[normalizeIconKey(slug)] ??
    CATEGORY_ICONS[normalizeIconKey(name)] ??
    Hash
  );
}

export function resolveAchievementIcon(icon?: string | null, slug?: string | null, title?: string | null): LucideIcon {
  return (
    ACHIEVEMENT_ICONS[normalizeIconKey(icon)] ??
    ACHIEVEMENT_ICONS[normalizeIconKey(slug)] ??
    ACHIEVEMENT_ICONS[normalizeIconKey(title)] ??
    Trophy
  );
}
