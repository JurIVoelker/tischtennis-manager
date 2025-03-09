"use client";

import { getAPI } from "@/lib/APIUtils";
import { useUserStore } from "@/store/store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Refresher = () => {
  const {
    clubSlug,
    setJoinedTeams,
    setClubSlug,
    setTeamSlug,
    setLeaderAt,
    setAdmin,
  } = useUserStore();
  const pathname = usePathname();

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
    if (typeof window !== "undefined") {
      const currentClubSlug = pathname.split("/")[1];
      const currentTeamSlug = pathname.split("/")[2];
      setClubSlug(currentClubSlug);
      setTeamSlug(currentTeamSlug);
    }
  }, [setClubSlug, setTeamSlug, pathname]);

  useEffect(() => {
    const getAuth = async () => {
      try {
        const { leaderAt, admin } =
          (await getAPI("/api/verify-auth"))?.data || {};
        setLeaderAt(
          leaderAt?.map((l: { clubName: string; teamName: string }) => ({
            clubSlug: l.clubName,
            teamSlug: l.teamName,
          }))
        );
        if (admin) setAdmin(true);
      } catch {}
    };
    getAuth();
  }, [clubSlug, setAdmin, setJoinedTeams, setLeaderAt]);

  return <></>;
};

export default Refresher;
