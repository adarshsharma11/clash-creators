import type { Metadata } from "next";
import { SupportRoute } from "@/components/support/support-route";

interface SupportPageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: SupportPageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `Support @${username} — ClashCreators`,
    description: "Support your favorite creator and help them climb today's Clash leaderboard.",
  };
}

export default async function SupportPage({ params }: SupportPageProps) {
  const { username } = await params;

  return <SupportRoute username={username} />;
}
