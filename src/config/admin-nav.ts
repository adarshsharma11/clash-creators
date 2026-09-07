import {
  CreditCard,
  Flag,
  Heart,
  LayoutDashboard,
  Layers,
  ScrollText,
  Settings,
  Swords,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminNavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminPrimaryNav: AdminNavLink[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/creators", label: "Creators", icon: Users },
  { href: "/admin/clashes", label: "Clashes", icon: Swords },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/supports", label: "Supports", icon: Heart },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/achievements", label: "Achievements", icon: Trophy },
];

export const adminSecondaryNav: AdminNavLink[] = [
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/audit-logs", label: "Audit logs", icon: ScrollText },
];

export function isAdminNavActive(pathname: string, href: string): boolean {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
