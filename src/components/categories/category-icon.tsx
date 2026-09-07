import {
  BookOpen,
  Clapperboard,
  Cpu,
  Dumbbell,
  Gamepad2,
  Hash,
  LayoutGrid,
  Music,
  Shirt,
  Smile,
  Sparkles,
  Utensils,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Book: BookOpen,
  BookOpen,
  Clapperboard,
  Cpu,
  Dumbbell,
  Gamepad: Gamepad2,
  Gamepad2,
  Music,
  Shirt,
  Smile,
  Sparkles,
  Utensils,
  book: BookOpen,
  clapperboard: Clapperboard,
  cpu: Cpu,
  dumbbell: Dumbbell,
  gamepad: Gamepad2,
  music: Music,
  shirt: Shirt,
  smile: Smile,
  sparkles: Sparkles,
  utensils: Utensils,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({ name, className }: CategoryIconProps) {
  const Icon = ICONS[name] ?? Hash;
  return <Icon className={className} aria-hidden="true" />;
}

export function AllCategoriesIcon({ className }: { className?: string }) {
  return <LayoutGrid className={className} aria-hidden="true" />;
}
