import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CURRENT_BATTLE_ID } from "@/data/constants";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-primary">404</p>
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">Page not found</h1>
        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          This clash, creator, or page does not exist, or it may have already ended.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Back home</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={`/clash/${CURRENT_BATTLE_ID}`}>Today&apos;s clash</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
