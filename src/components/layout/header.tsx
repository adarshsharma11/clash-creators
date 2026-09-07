"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Crown, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import { useLiveClash } from "@/hooks/queries/use-clashes";
import { CURRENT_BATTLE_ID } from "@/data/constants";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const liveQuery = useLiveClash();
  const clashHref = `/clash/${liveQuery.data?.slug ?? CURRENT_BATTLE_ID}`;
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = () => {
    if (signingOut) {
      return;
    }
    setSigningOut(true);
    void logout().finally(() => setSigningOut(false));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" />
            <span className="font-bold tracking-tight text-lg">CLASHCREATORS</span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/categories" className="hover:text-foreground transition-colors">Categories</Link>
            <Link href="/creators" className="hover:text-foreground transition-colors">Creators</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/rules" className="hover:text-foreground transition-colors">Rules</Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href={clashHref}>
            <Badge variant="secondary" className="flex gap-1.5 items-center px-3 py-1">
              <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
              <span className="animate-pulse text-orange-500">Live</span>
            </Badge>
          </Link>
          <Button asChild size="sm" className="bg-primary text-primary-foreground">
            <Link href="/join-clash">Join Clash</Link>
          </Button>
          {isAuthenticated ? (
            <Button size="sm" variant="outline" onClick={handleLogout} disabled={signingOut}>
              {signingOut ? "Signing out…" : `Sign out ${user?.username ?? ""}`}
            </Button>
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
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/40 bg-background px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-4 text-sm font-medium">
            <Link href="/categories" className="text-foreground" onClick={() => setMobileMenuOpen(false)}>Categories</Link>
            <Link href="/creators" className="text-foreground" onClick={() => setMobileMenuOpen(false)}>Creators</Link>
            <Link href="/about" className="text-foreground" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link href="/rules" className="text-foreground" onClick={() => setMobileMenuOpen(false)}>Rules</Link>
          </nav>
          <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
            <Link href={clashHref} className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
              <Badge variant="secondary" className="flex gap-1.5 items-center">
                <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                <span className="text-orange-500">Live</span>
              </Badge>
              <span className="text-sm font-medium">Current Battle</span>
            </Link>
            <Button asChild className="w-full justify-center">
              <Link href="/join-clash" onClick={() => setMobileMenuOpen(false)}>Join Clash</Link>
            </Button>
            {isAuthenticated ? (
              <Button className="w-full" variant="outline" onClick={handleLogout} disabled={signingOut}>
                {signingOut ? "Signing out…" : "Sign out"}
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
