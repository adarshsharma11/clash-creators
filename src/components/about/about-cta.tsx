import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn } from "./fade-in";

export function AboutCta() {
  return (
    <section className="border-b border-border/40 py-20">
      <div className="container mx-auto max-w-3xl px-4 text-center sm:px-8">
        <FadeIn>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to see who&apos;s leading?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Explore the creators, find a Clash, and see where the competition stands.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-8 font-bold">
              <Link href="/#creators">Explore Creators</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 font-bold">
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
