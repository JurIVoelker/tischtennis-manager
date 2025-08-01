"use client";

import { getAPI } from "@/lib/APIUtils";
import { useUserStore } from "@/store/store";
import { useSession } from "next-auth/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Refresher = () => {
  const clubSlug = useUserStore((state) => state.clubSlug);
  const setClubSlug = useUserStore((state) => state.setClubSlug);
  const setTeamSlug = useUserStore((state) => state.setTeamSlug);
  const setLeaderAt = useUserStore((state) => state.setLeaderAt);
  const setAdmin = useUserStore((state) => state.setAdmin);

  const pathname = usePathname();

  const { refresh } = useRouter();
  const params = useSearchParams();
  const session = useSession();

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
        setAdmin(Boolean(admin));
      } catch {}
    };
    if (session.status === "authenticated") {
      getAuth();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubSlug, session]);

  return <></>;
};

export default Refresher;
