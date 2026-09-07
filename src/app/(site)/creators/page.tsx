import type { Metadata } from "next";
import { CreatorsExperience } from "@/components/creators/creators-experience";

export const metadata: Metadata = {
  title: "Creators — ClashCreators",
  description: "Browse ClashCreators and support the creators competing in live clashes.",
};

export default function CreatorsPage() {
  return (
    <main className="container mx-auto max-w-5xl flex-1 px-4 py-12 sm:px-8 sm:py-16">
      <CreatorsExperience />
    </main>
  );
}
