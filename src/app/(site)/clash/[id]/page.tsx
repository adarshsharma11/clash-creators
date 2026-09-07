import type { Metadata } from "next";
import { ClashExperience } from "@/components/clash/clash-experience";

interface BattlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: BattlePageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: "Clash — ClashCreators",
    description: `Follow the live ranking for ${id}.`,
  };
}

export default async function BattlePage({ params }: BattlePageProps) {
  const { id } = await params;

  return <ClashExperience clashId={id} />;
}
