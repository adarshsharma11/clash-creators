import Link from "next/link";
import { Crown } from "lucide-react";
import { InstagramMark } from "@/components/ui/instagram-mark";
import { legalContact } from "@/config/legal";
import { CURRENT_BATTLE_ID } from "@/data/constants";
import { socialProfiles } from "@/config/social";

export function Footer() {
  const clashHref = `/clash/${CURRENT_BATTLE_ID}`;

  return (
    <footer className="border-t border-border/40 bg-background/50 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Crown className="h-6 w-6 text-primary" />
              <span className="font-bold tracking-tight text-lg">CLASHCREATORS</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Every day, creators battle for the crown.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/creators" className="hover:text-primary transition-colors">Creators</Link></li>
              <li><Link href={clashHref} className="hover:text-primary transition-colors">Today&apos;s Clash</Link></li>
              <li><Link href="/join-clash" className="hover:text-primary transition-colors">Join Clash</Link></li>
              <li><Link href="/winners" className="hover:text-primary transition-colors">Hall of Fame</Link></li>
              <li><Link href="/rules" className="hover:text-primary transition-colors">Rules</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li>
                <a
                  href={legalContact.emailHref}
                  className="hover:text-primary transition-colors"
                >
                  {legalContact.email}
                </a>
              </li>
              <li>
                {socialProfiles.instagram.url ? (
                  <a
                    href={socialProfiles.instagram.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <InstagramMark className="h-3.5 w-3.5" />
                    {socialProfiles.instagram.displayHandle}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <InstagramMark className="h-3.5 w-3.5" />
                    {socialProfiles.instagram.displayHandle}
                  </span>
                )}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 ClashCreators. All rights reserved.</p>
          <p>Designed for the next generation of creators.</p>
        </div>
      </div>
    </footer>
  );
}
