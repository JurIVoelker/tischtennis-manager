import { hasPermission, permission } from "@/lib/auth";
import { useUserStore } from "@/store/store";
import { useEffect, useState } from "react";

export function useIsPermitted(permission: permission) {
  const clubSlug = useUserStore((state) => state.clubSlug);
  const teamSlug = useUserStore((state) => state.teamSlug);
  const admin = useUserStore((state) => state.admin);
  const leaderAt = useUserStore((state) => state.leaderAt);

  const [isPermitted, setPermitted] = useState<boolean | null>(null);
  useEffect(() => {
    if (hasPermission(permission)) setPermitted(true);
    else setPermitted(false);
  }, [permission, clubSlug, teamSlug, admin, leaderAt]);

  return isPermitted;
}
