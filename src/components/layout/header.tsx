"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X, Crown, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAuth } from "@/context/auth-context";
import { useLiveClash } from "@/hooks/queries/use-clashes";
import { CURRENT_BATTLE_ID } from "@/data/constants";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/categories", label: "Categories" },
  { href: "/creators", label: "Creators" },
  { href: "/about", label: "About" },
  { href: "/rules", label: "Rules" },
] as const;

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuOpen = menuPath === pathname;
  const { user, isAuthenticated, logout } = useAuth();
  const liveQuery = useLiveClash();
  const clash = liveQuery.data;
  const clashHref = `/clash/${clash?.slug ?? CURRENT_BATTLE_ID}`;
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    if (signingOut) {
      return;
    }
    setSigningOut(true);
    void logout().finally(() => setSigningOut(false));
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-colors",
        scrolled
          ? "border-border/50 bg-background/90 backdrop-blur-md"
          : "border-border/40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2" aria-label="ClashCreators home">
            <Crown className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">CLASHCREATORS</span>
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground md:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = isActivePath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "transition-colors hover:text-foreground",
                    active && "text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link href={clashHref} className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {clash?.status === "LIVE" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/12 px-3 py-1 text-xs font-bold uppercase tracking-wider text-orange-400">
                <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" aria-hidden="true" />
                Live
              </span>
            ) : clash?.status ? (
              <StatusBadge status={clash.status} />
            ) : null}
          </Link>
          <Button asChild size="sm" className="h-9 bg-primary text-primary-foreground">
            <Link href="/join-clash">Join Clash</Link>
          </Button>
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="max-w-[8rem] truncate text-sm font-semibold">@{user?.username}</span>
              <Button size="sm" variant="outline" onClick={handleLogout} disabled={signingOut}>
                {signingOut ? "Signing out…" : "Sign out"}
              </Button>
            </div>
          ) : (
            <>
              <Button asChild size="sm" variant="ghost">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="p-2 text-foreground md:hidden"
          onClick={() => setMenuPath((current) => (current === pathname ? null : pathname))}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <motion.div
            id="mobile-nav"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
            className="overflow-hidden border-b border-border/40 bg-background md:hidden"
          >
            <div className="space-y-4 px-4 py-4">
              <nav className="flex flex-col gap-1 text-sm font-medium" aria-label="Mobile">
                {NAV_LINKS.map((link) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-2 py-2.5",
                        active ? "bg-secondary text-foreground" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="flex flex-col gap-3 border-t border-border/40 pt-4">
                <Link href={clashHref} className="flex items-center gap-2">
                  {clash?.status === "LIVE" ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-400">
                      <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" aria-hidden="true" />
                      Live clash
                    </span>
                  ) : (
                    <span className="text-sm font-medium">Current clash</span>
                  )}
                </Link>
                {isAuthenticated ? (
                  <p className="text-sm text-muted-foreground">Signed in as @{user?.username}</p>
                ) : null}
                <Button asChild className="w-full justify-center bg-primary text-primary-foreground">
                  <Link href="/join-clash">Join Clash</Link>
                </Button>
                {isAuthenticated ? (
                  <Button className="w-full" variant="outline" onClick={handleLogout} disabled={signingOut}>
                    {signingOut ? "Signing out…" : "Sign out"}
                  </Button>
                ) : (
                  <>
                    <Button asChild variant="ghost" className="w-full">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
