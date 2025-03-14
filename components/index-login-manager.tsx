"use client";

import { usePathname, useRouter } from "next/navigation";
import GoogleLoginButton from "./google-login-button";
import { getAPI } from "@/lib/APIUtils";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Typography from "./typography";
import { ERRORS } from "@/constants/prismaErrors";
import { useUserStore } from "@/store/store";

const IndexLoginManager = () => {
  const pathName = usePathname();
  const { push } = useRouter();
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const { joinedTeams, clubSlug, setLeaderAt, setAdmin } = useUserStore();

  const verifyToken = async () => {
    try {
      const response = await getAPI("/api/verify-auth");
      const { leaderAt, admin, clubSlug } = response.data || {};
      if (!leaderAt?.length && !admin) {
        signOut({
          callbackUrl: `${pathName}?error=${ERRORS.INVALID_LOGIN_ERROR}`,
        });
        return;
      }
      if (!leaderAt?.length && admin) {
        push(`/${clubSlug}/admin/verwalten`);
        return;
      }
      if (leaderAt?.length) {
        setLeaderAt(
          leaderAt.map((l: { clubName: string; teamName: string }) => ({
            clubSlug: l.clubName,
            teamSlug: l.teamName,
          }))
        );
      }
      if (admin) setAdmin(true);
      const pushTarget = leaderAt[0];
      push(`/${pushTarget.clubName}/${pushTarget.teamName}`);
    } catch {
      setError("Ein unerwarteter Fehler ist aufgetreten.");
    }
  };

  useEffect(() => {
    if (joinedTeams.length > 0) push(`/${clubSlug}/${joinedTeams[0].teamSlug}`);
    if (session) verifyToken();
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    if (errorParam) {
      setError(errorParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <>
      <GoogleLoginButton
        callbackUrl={pathName}
        includeText={false}
        className="mt-3"
      />
      {error && (
        <Typography variant="error">
          {error === ERRORS.INVALID_LOGIN_ERROR
            ? "Du bist kein Mannschaftsführer. Bitte versuche es später erneut, oder kontaktiere einen Administrator"
            : error}
        </Typography>
      )}
    </>
  );
};

export default IndexLoginManager;
