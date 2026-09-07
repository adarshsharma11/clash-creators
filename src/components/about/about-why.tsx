import { Eye, Heart, Trophy } from "lucide-react";
import { FadeIn } from "./fade-in";

const principles = [
  {
    title: "Transparency",
    body: "See where creators stand.",
    icon: Eye,
  },
  {
    title: "Competition",
    body: "Every position matters.",
    icon: Trophy,
  },
  {
    title: "Community",
    body: "Support can change the outcome.",
    icon: Heart,
  },
] as const;

export function AboutWhy() {
  return (
    <section className="border-b border-border/40 py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-8">
        <FadeIn className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Competition should be visible.
          </h2>
        </FadeIn>

        <FadeIn delay={0.05}>
          <blockquote className="mb-10 rounded-3xl border border-primary/20 bg-primary/[0.06] px-6 py-8 text-2xl font-semibold tracking-tight sm:px-10 sm:text-3xl">
            Instead of hidden metrics and endless feeds, ClashCreators puts the
            competition on the board.
          </blockquote>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((item, index) => (
            <FadeIn key={item.title} delay={0.08 + index * 0.05}>
              <article className="rounded-2xl border border-border/50 bg-card/40 p-6">
                <item.icon className="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider">{item.title}</h3>
                <p className="text-muted-foreground">{item.body}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
