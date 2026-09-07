export type SocialProfile = {
  handle: string;
  displayHandle: string;
  url: string | null;
};

export const socialProfiles = {
  instagram: {
    handle: "clashcreators",
    displayHandle: "@clashcreators",
    url: "https://www.instagram.com/clashcreators/",
  },
} as const satisfies Record<string, SocialProfile>;
