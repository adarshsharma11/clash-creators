import { FadeIn } from "./fade-in";

const steps = [
  {
    number: "01",
    title: "Discover",
    body: "Find creators and Clashes that interest you.",
  },
  {
    number: "02",
    title: "Choose",
    body: "Pick the creator you want to support.",
  },
  {
    number: "03",
    title: "Support",
    body: "Choose your support amount and confirm.",
  },
  {
    number: "04",
    title: "Watch",
    body: "Follow the leaderboard as the competition changes.",
  },
] as const;

export function AboutHowItWorks() {
  return (
    <section className="border-b border-border/40 py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-8">
        <FadeIn className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            How ClashCreators works
          </h2>
        </FadeIn>

        <ol className="relative grid gap-6 md:grid-cols-4">
          <div className="pointer-events-none absolute top-8 right-[12%] left-[12%] hidden h-px bg-border md:block" />
          {steps.map((step, index) => (
            <FadeIn key={step.number} delay={index * 0.07}>
              <li className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card font-mono text-sm font-bold text-primary">
                  {step.number}
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            </FadeIn>
          ))}
        </ol>
      </div>
    </section>
  );
}
