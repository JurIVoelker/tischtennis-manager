"use client";

import { getAPI } from "@/lib/APIUtils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Refresher = () => {
  const { refresh } = useRouter();
  const params = useSearchParams();
  useEffect(() => {
    const isRefresh = params.get("refresh");
    if (isRefresh) {
      const url = new URL(window.location.href);
      url.searchParams.delete("refresh");
      window.history.replaceState(null, "", url.toString());
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, refresh]);

  useEffect(() => {
    const getAuth = async () => {
      try {
        const response = await getAPI("/api/verify-auth");
        const { leaderAt, admin } = response.data || {};
        if (leaderAt) {
          localStorage.setItem("leaderAt", JSON.stringify(leaderAt));
        }
        if (admin) {
          localStorage.setItem("admin", "true");
        }
      } catch {}
    };
    getAuth();
  }, []);

  return <></>;
};

export default Refresher;
