import { FadeIn } from "./fade-in";

const ideas = [
  {
    number: "01",
    title: "Creators",
    body: "Creators enter the competition and build their position on the leaderboard.",
  },
  {
    number: "02",
    title: "Supporters",
    body: "Supporters back the creators they want to see rise.",
  },
  {
    number: "03",
    title: "Clashes",
    body: "Live competitions turn that support into a changing public leaderboard.",
  },
] as const;

export function AboutIntro() {
  return (
    <section className="border-b border-border/40 py-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-8">
        <FadeIn className="mb-12 max-w-2xl">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
            What is ClashCreators?
          </h2>
          <p className="text-lg text-muted-foreground">
            ClashCreators is a public platform where creators compete in Clashes and
            supporters help their favorite creators climb the leaderboard.
          </p>
        </FadeIn>

        <div className="grid gap-4 md:grid-cols-3">
          {ideas.map((idea, index) => (
            <FadeIn key={idea.number} delay={index * 0.06}>
              <article className="h-full rounded-2xl border border-border/50 bg-card/40 p-6">
                <p className="mb-4 font-mono text-sm font-bold text-primary">{idea.number}</p>
                <h3 className="mb-2 text-xl font-bold">{idea.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{idea.body}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
