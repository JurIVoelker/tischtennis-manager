type role = "user" | "leader" | "admin";
type permission = "";

interface RoleProps {
  user: permission[];
  leader: permission[];
  admin: permission[];
}

export const ROLES: RoleProps = {
  user: [],
  leader: [],
  admin: [],
} as const;

export function hasPermission(role: role, permission: permission) {
  return ROLES[role].includes(permission);
}
