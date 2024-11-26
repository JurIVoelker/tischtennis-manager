"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { GoogleIcon } from "hugeicons-react";

const GoogleLoginButton = () => {
  const { data: session } = useSession();

  return (
    <>
      {JSON.stringify(session)}
      {session && <Button onClick={() => signOut()}>Ausloggen</Button>}
      {!session && (
        <Button
          onClick={() =>
            signIn("google", {
              callbackUrl:
                "http://localhost:3000/login" || window.location.href,
              redirect: true,
            })
          }
        >
          <GoogleIcon /> Mit Google anmelden
        </Button>
      )}
    </>
  );
};

export default GoogleLoginButton;
