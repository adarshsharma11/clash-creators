import type { Metadata } from "next";
import { CreatorProfileExperience } from "@/components/creators/creator-profile-experience";

interface CreatorPageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: CreatorPageProps): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `@${username} — ClashCreators`,
    description: `Support @${username} in live creator clashes.`,
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { username } = await params;

  return <CreatorProfileExperience username={username} />;
}
