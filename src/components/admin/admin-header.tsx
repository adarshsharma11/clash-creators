"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { AdminBreadcrumbs, type AdminBreadcrumb } from "@/components/admin/admin-breadcrumbs";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { Button } from "@/components/ui/button";
import { adminPrimaryNav, adminSecondaryNav } from "@/config/admin-nav";
import { useAdminAuth } from "@/context/admin-auth-context";
import { useAdminSignOut } from "@/hooks/mutations/use-admin-sign-out";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const pathname = usePathname();
  const { admin } = useAdminAuth();
  const { signOut, isPending: signingOut } = useAdminSignOut();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const crumbs = breadcrumbsForPath(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border/40 bg-background/95 px-4 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open admin menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <AdminBreadcrumbs items={crumbs} />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="relative" ref={menuRef}>
          <Button
            variant="ghost"
            size="sm"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {admin?.name ?? "Admin"}
          </Button>
          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-44 rounded-xl border border-border/50 bg-card p-1 shadow-xl"
            >
              <Link
                href="/admin/settings"
                role="menuitem"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/admin/settings"
                role="menuitem"
                className="block rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                onClick={() => setMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                type="button"
                role="menuitem"
                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary"
                onClick={() => {
                  setMenuOpen(false);
                  setLogoutOpen(true);
                }}
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <AdminConfirmDialog
        open={logoutOpen}
        title="Log out?"
        description="You will need to sign in again to manage ClashCreators."
        confirmLabel="Logout"
        confirming={signingOut}
        onClose={() => setLogoutOpen(false)}
        onConfirm={signOut}
      />
    </header>
  );
}

function breadcrumbsForPath(pathname: string): AdminBreadcrumb[] {
  const items: AdminBreadcrumb[] = [{ label: "Admin", href: "/admin" }];
  const all = [...adminPrimaryNav, ...adminSecondaryNav];
  const match = all.find((item) => item.href !== "/admin" && pathname.startsWith(item.href));

  if (match) {
    items.push({ label: match.label, href: match.href });
  }

  return items;
}
