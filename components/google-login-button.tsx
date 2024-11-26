"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { GoogleIcon } from "hugeicons-react";
import { usePathname } from "next/navigation";
import Typography from "./typography";
import { asyncLog } from "@/lib/logUtils";
import { useEffect } from "react";

const GoogleLoginButton = () => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const clubSlug = pathName.split("/")[1];
  const teamSlug = pathName.split("/")[2];

  useEffect(() => {
    asyncLog(
      "info",
      JSON.stringify({
        protocol: window.location.protocol,
        host: window.location.host,
        clubSlug,
        whole: `${window.location.protocol}//${window.location.host}/${clubSlug}/${teamSlug}/mannschaftsfuehrer/login/validieren`,
      })
    );
  }, [clubSlug, teamSlug]);

  return (
    <>
      {session && (
        <>
          <Typography variant="p" className="leading-10 mt-4 mb-2">
            Du bist bereits eingeloggt. Möchtest du dich ausloggen?
          </Typography>

          <Button onClick={() => signOut()}>Ausloggen</Button>
        </>
      )}
      {!session && (
        <>
          <Typography variant="p" className="leading-10 mt-4 mb-2">
            Bitte melde dich mit deinem Google-Konto an.
          </Typography>
          <Button
            onClick={() =>
              signIn("google", {
                callbackUrl: `${window.location.protocol}//${window.location.host}/${clubSlug}/${teamSlug}/mannschaftsfuehrer/login/validieren`,
                redirect: true,
              })
            }
          >
            <GoogleIcon /> Mit Google anmelden
          </Button>
        </>
      )}
    </>
  );
};

export default GoogleLoginButton;
