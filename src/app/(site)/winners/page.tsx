import type { Metadata } from "next";
import { WinnersExperience } from "@/components/winners/winners-experience";

export const metadata: Metadata = {
  title: "Hall of Fame — ClashCreators",
};

export default function WinnersPage() {
  return <WinnersExperience />;
}
