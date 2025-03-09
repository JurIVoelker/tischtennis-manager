import { create } from "zustand";
import { persist } from "zustand/middleware";

type LeaderAt = {
  clubSlug: string;
  teamSlug: string;
};

type JoinableTeam = {
  teamSlug: string;
  playerId: string;
};

type DeclinedJoins = {
  clubSlug: string;
  teamSlug: string;
  joinDeclined: boolean;
};

type Store = {
  clubSlug: string;
  setClubSlug: (clubSlug: string) => void;
  teamSlug: string;
  setTeamSlug: (teamSlug: string) => void;
  joinedTeams: JoinableTeam[];
  setJoinedTeams: (joinedTeams: JoinableTeam[]) => void;
  leaderAt: LeaderAt[];
  setLeaderAt: (leaderAt: LeaderAt[]) => void;
  admin: boolean;
  setAdmin: (admin: boolean) => void;
  clearLeaderAt: () => void;
  addLeaderAt: (leaderAt: LeaderAt) => void;
  removeLeaderAt: (leaderAt: LeaderAt) => void;
  leaveTeam: (teamSlug: string) => void;
  joinTeam: (teamSlug: string, playerId: string) => void;
  declinedJoins: DeclinedJoins[];
  declineJoin: (clubSlug: string, teamSlug: string) => void;
  clear: () => void;
};

export const useUserStore = create<Store>()(
  persist(
    (set, get) => ({
      clubSlug: "",
      setClubSlug: (clubSlug) => set({ clubSlug }),

      teamSlug: "",
      setTeamSlug: (teamSlug) => set({ teamSlug }),

      admin: false,
      setAdmin: (admin) => set({ admin }),

      joinedTeams: [],
      setJoinedTeams: (joinedTeams) => set({ joinedTeams }),
      leaveTeam: (teamSlug) =>
        set({
          joinedTeams: get().joinedTeams.filter(
            (item) => item.teamSlug !== teamSlug
          ),
        }),
      joinTeam: (teamSlug, playerId) =>
        set({ joinedTeams: [...get().joinedTeams, { teamSlug, playerId }] }),

      // Leader at
      leaderAt: [],
      setLeaderAt: (leaderAt: LeaderAt[]) => set({ leaderAt: leaderAt }),
      clearLeaderAt: () => set({ leaderAt: [] }),
      addLeaderAt: (leaderAt: LeaderAt) =>
        set({ leaderAt: [...get().leaderAt, leaderAt] }),
      addLeadersAt: (leadersAt: LeaderAt[]) =>
        set({ leaderAt: [...get().leaderAt, ...leadersAt] }),
      removeLeaderAt: (leaderAt: LeaderAt) =>
        set({
          leaderAt: get().leaderAt.filter(
            (item) =>
              item.clubSlug !== leaderAt.clubSlug &&
              item.teamSlug !== leaderAt.teamSlug
          ),
        }),

      // Decline join
      declinedJoins: [],
      declineJoin: (clubSlug, teamSlug) => {
        set({
          declinedJoins: [
            ...get().declinedJoins.filter(
              (item) => item.teamSlug !== teamSlug && item.clubSlug !== clubSlug
            ),
            { clubSlug, teamSlug, joinDeclined: true },
          ],
        });
      },

      clear: () =>
        set({
          clubSlug: "",
          teamSlug: "",
          admin: false,
          joinedTeams: [],
          leaderAt: [],
          declinedJoins: [],
        }),
    }),
    {
      name: "main-storage", // name of the item in the storage (must be unique)
    }
  )
);
