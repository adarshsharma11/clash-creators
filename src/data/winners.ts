export type Winner = {
  id: string;
  date: string;
  creator: {
    username: string;
    displayName: string;
    avatarUrl: string;
  };
  supportPoints: number;
  title: string;
};

export const pastWinners: Winner[] = [
  {
    id: "w_1",
    date: "Sept 6",
    creator: {
      username: "alex_carter",
      displayName: "Alex Carter",
      avatarUrl: "https://i.pravatar.cc/150?u=alex",
    },
    supportPoints: 31290,
    title: "Champion",
  },
  {
    id: "w_2",
    date: "Sept 5",
    creator: {
      username: "sarah_fitness",
      displayName: "Sarah Jenkins",
      avatarUrl: "https://i.pravatar.cc/150?u=sarah",
    },
    supportPoints: 14810,
    title: "Champion",
  },
  {
    id: "w_3",
    date: "Sept 4",
    creator: {
      username: "mikemakesjokes",
      displayName: "Mike Comedy",
      avatarUrl: "https://i.pravatar.cc/150?u=mike",
    },
    supportPoints: 22450,
    title: "Champion",
  },
];
