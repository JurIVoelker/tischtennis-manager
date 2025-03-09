import { useUserStore } from "@/store/store";

type role = "member" | "leader" | "admin" | "viewer";
export type permission =
  | "view:game-card-options"
  | "view:players-card-options"
  | "view:add-new-game"
  | "view:add-lineup-in-game-card-body"
  | "view:game-availability-buttons"
  | "view:manage-leaders-button"
  | "view:manage-admin-button";

interface RoleProps {
  viewer: permission[];
  leader: permission[];
  member: permission[];
  admin: permission[];
}

export const ROLES: RoleProps = {
  viewer: [],
  member: ["view:game-availability-buttons"],
  leader: [
    "view:add-new-game",
    "view:game-card-options",
    "view:add-lineup-in-game-card-body",
    "view:players-card-options",
  ],
  admin: ["view:manage-admin-button", "view:manage-leaders-button"],
} as const;

export const getRole = (): role[] => {
  const roles: role[] = ["viewer"];
  const {
    joinedTeams,
    leaderAt,
    teamSlug,
    clubSlug,
    admin: isAdmin,
  } = useUserStore.getState() || {};

  const isLeader = leaderAt?.find(
    (item) => item.teamSlug === teamSlug && item.clubSlug === clubSlug
  );
  if (isLeader) roles.push("leader");
  if (isAdmin) roles.push("admin");

  const userId = joinedTeams?.find(
    (team) => team.teamSlug === teamSlug
  )?.playerId;

  if (userId) roles.push("member");
  return roles;
};

export function hasPermission(permission: permission, role?: role) {
  const roles: role[] = role ? [role] : getRole();
  return roles.some((role) => ROLES[role].includes(permission));
}
