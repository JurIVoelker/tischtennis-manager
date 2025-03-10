import { hasPermission, permission } from "@/lib/auth";
import { useUserStore } from "@/store/store";
import { useEffect, useState } from "react";

export function useIsPermitted(permission: permission) {
  const { clubSlug, teamSlug, admin, leaderAt } = useUserStore();
  const [isPermitted, setPermitted] = useState<boolean | null>(null);
  useEffect(() => {
    if (hasPermission(permission)) setPermitted(true);
    else setPermitted(false);
  }, [permission, clubSlug, teamSlug, admin, leaderAt]);

  return isPermitted;
}
