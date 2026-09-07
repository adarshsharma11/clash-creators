import type { Metadata } from "next";
import { JoinClashExperience } from "@/components/join-clash/join-clash-experience";

export const metadata: Metadata = {
  title: "Join a Clash — ClashCreators",
  description: "Enter the ClashCreators competition and get ready to compete.",
};

export default function JoinClashPage() {
  return (
    <main className="flex flex-1 flex-col">
      <JoinClashExperience />
    </main>
  );
}
