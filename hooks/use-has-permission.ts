import { hasPermission, permission } from "@/lib/auth";
import { useEffect, useState } from "react";

export function useIsPermitted(permission: permission) {
  const [isPermitted, setPermitted] = useState<boolean | null>(null);
  useEffect(() => {
    if (hasPermission(permission)) setPermitted(true);
    else setPermitted(false);
  }, [permission]);

  return isPermitted;
}
