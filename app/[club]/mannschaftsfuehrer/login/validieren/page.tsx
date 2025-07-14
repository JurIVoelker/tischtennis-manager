"use client";
import Typography from "@/components/typography";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/store";
import { Loader2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ValidateLeaderLoggedInPage = () => {
  const { push } = useRouter();
  const leaderAt = useUserStore((state) => state.leaderAt);
  const admin = useUserStore((state) => state.admin);
  const clubSlug = useUserStore((state) => state.clubSlug);
  const session = useSession();

  useEffect(() => {
    if (leaderAt?.length > 0) {
      push(`/${leaderAt[0].clubSlug}/${leaderAt[0].teamSlug}`);
    } else if (admin === true) {
      push(`/${clubSlug}/admin/verwalten`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaderAt, admin]);

  useEffect(() => {
    if (session.status === "unauthenticated" && session.data !== null) {
      window.location.reload();
    }
  }, [session]);

  const logout = () => {
    signOut();
    push("/" + clubSlug);
  };

  const unauthenticated =
    (session.status === "authenticated" && !leaderAt?.length && !admin) ||
    (session.status === "unauthenticated" && session.data === null);

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-center flex-col h-svh  ">
        {!unauthenticated && (
          <>
            <div>
              <Loader2 className="animate-spin" size={32} />
            </div>
            <Typography variant="p-gray" className="mt-2">
              Dein Konto wird validiert. Bitte warte einen Moment.
            </Typography>
          </>
        )}
        {unauthenticated && (
          <>
            <Typography variant="h3" className="mt-2 w-[90%] text-center">
              Authentifizierungsfehler
            </Typography>
            <Typography
              variant="error"
              className="mt-2 max-w-[400px] text-center w-[90%]"
            >
              Du hast keine Berechtigungen. Lade diese Seite neu. Falls der
              Fehler besteht, melde dich bei einem Administrator.
            </Typography>
            <Button variant="outline" className="mt-6" onClick={logout}>
              Zurück zur Startseite
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ValidateLeaderLoggedInPage;
