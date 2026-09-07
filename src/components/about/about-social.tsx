import { InstagramMark } from "@/components/ui/instagram-mark";
import { legalContact } from "@/config/legal";
import { socialProfiles } from "@/config/social";
import { FadeIn } from "./fade-in";

export function AboutSocial() {
  const instagram = socialProfiles.instagram;

  return (
    <section className="py-20">
      <div className="container mx-auto max-w-3xl px-4 text-center sm:px-8">
        <FadeIn>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight">
            Follow the ClashCreators journey.
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Follow {instagram.displayHandle} for creator highlights, new Clashes, updates,
            and community moments.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            {instagram.url ? (
              <a
                href={instagram.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-border/50 px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
              >
                <InstagramMark className="h-4 w-4" />
                {instagram.displayHandle}
              </a>
            ) : (
              <p className="inline-flex items-center gap-3 rounded-full border border-border/50 px-5 py-3 text-sm font-semibold">
                <InstagramMark className="h-4 w-4" />
                {instagram.displayHandle}
              </p>
            )}
            <a
              href={legalContact.emailHref}
              className="inline-flex items-center gap-3 rounded-full border border-border/50 px-5 py-3 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
            >
              {legalContact.email}
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
