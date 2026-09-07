"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { AdminNavItem } from "@/components/admin/admin-nav-item";
import { Button } from "@/components/ui/button";
import { ADMIN_SIDEBAR_STORAGE_KEY } from "@/config/demo-admin";
import { adminPrimaryNav, adminSecondaryNav, isAdminNavActive } from "@/config/admin-nav";
import { useAdminAuth } from "@/context/admin-auth-context";
import { useAdminSignOut } from "@/hooks/mutations/use-admin-sign-out";
import { canManageSettings } from "@/lib/admin-permissions";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { admin } = useAdminAuth();
  const { signOut, isPending: signingOut } = useAdminSignOut();
  const [collapsed, setCollapsed] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(ADMIN_SIDEBAR_STORAGE_KEY);
    if (stored === "collapsed") {
      queueMicrotask(() => setCollapsed(true));
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    window.localStorage.setItem(ADMIN_SIDEBAR_STORAGE_KEY, next ? "collapsed" : "expanded");
  };

  const handleLogout = () => {
    onMobileClose();
    signOut();
  };

  const nav = (isCollapsed: boolean) => (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-2 border-b border-border/40 px-3 py-4", isCollapsed && "justify-center")}>
        <Link href="/admin" className="flex items-center gap-2" onClick={onMobileClose}>
          <Crown className="h-5 w-5 text-primary" />
          {!isCollapsed ? (
            <span className="text-sm font-bold tracking-tight">CLASHCREATORS</span>
          ) : (
            <span className="sr-only">ClashCreators Admin</span>
          )}
        </Link>
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-1 overflow-y-auto p-3">
        {adminPrimaryNav.map((item) => (
          <AdminNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={isAdminNavActive(pathname, item.href)}
            collapsed={isCollapsed}
            onNavigate={onMobileClose}
          />
        ))}
        <div className="my-3 border-t border-border/40" />
        {adminSecondaryNav
          .filter((item) => item.href !== "/admin/settings" || canManageSettings(admin?.role))
          .map((item) => (
          <AdminNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={isAdminNavActive(pathname, item.href)}
            collapsed={isCollapsed}
            onNavigate={onMobileClose}
          />
        ))}
      </nav>

      <div className="border-t border-border/40 p-3">
        <div className={cn("mb-3 flex items-center gap-3 rounded-lg bg-secondary/40 p-2", isCollapsed && "justify-center")}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
            {admin?.name.slice(0, 1) ?? "A"}
          </div>
          {!isCollapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{admin?.name}</p>
              <p className="truncate text-xs text-muted-foreground">{admin?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</p>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn("flex-1", isCollapsed && "px-2")}
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed ? <span className="ml-2">Logout</span> : <span className="sr-only">Logout</span>}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-9 w-9 lg:inline-flex"
            onClick={toggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 border-r border-border/40 bg-background lg:block",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        {nav(collapsed)}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Close menu"
            onClick={onMobileClose}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="relative h-full w-64 max-w-[85vw] border-r border-border/40 bg-background"
          >
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="sm" onClick={onMobileClose}>
                Close
              </Button>
            </div>
            <div className="h-[calc(100%-48px)]">{nav(false)}</div>
          </aside>
        </div>
      ) : null}

      <AdminConfirmDialog
        open={logoutOpen}
        title="Log out?"
        description="You will need to sign in again to manage ClashCreators."
        confirmLabel="Logout"
        confirming={signingOut}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
