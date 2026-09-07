import { Supporter } from "@/types/supporter";

export const getTopSupportersForCreator = (): Supporter[] => {
  return [
    {
      id: "s1",
      username: "john_doe",
      displayName: "John Doe",
      avatarUrl: "https://i.pravatar.cc/150?u=john",
      supportAmount: 2500,
    },
    {
      id: "s2",
      username: "sarah_smith",
      displayName: "Sarah Smith",
      avatarUrl: "https://i.pravatar.cc/150?u=sarah",
      supportAmount: 1200,
    },
    {
      id: "s3",
      username: "mike_jones",
      displayName: "Mike Jones",
      avatarUrl: "https://i.pravatar.cc/150?u=mike",
      supportAmount: 850,
    },
    {
      id: "s4",
      username: "emily_r",
      displayName: "Emily R",
      avatarUrl: "https://i.pravatar.cc/150?u=emily",
      supportAmount: 450,
    },
  ];
};
