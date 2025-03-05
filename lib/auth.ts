import { getUserData } from "./localstorageUtils";

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
  const clubSlug = window.location.pathname.split("/")[1];
  const teamSlug = window.location.pathname.split("/")[2];

  const leaderAt = JSON.parse(localStorage.getItem("leaderAt") || "[]");
  const isLeader = leaderAt.some(
    (leaderData: { clubName: string; teamName: string }) =>
      leaderData.clubName === clubSlug && leaderData.teamName === teamSlug
  );
  const isAdmin  = localStorage.getItem("admin") === "true";
  if (isAdmin) roles.push("admin");
  if (isLeader) roles.push("leader");
  const userData = getUserData();
  if (userData[teamSlug]?.id) roles.push("member");
  return roles;
};

export function hasPermission(permission: permission, role?: role) {
  const roles: role[] = role ? [role] : getRole();
  return roles.some((role) => ROLES[role].includes(permission));
}
