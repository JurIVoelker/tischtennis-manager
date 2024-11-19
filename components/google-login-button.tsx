"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";

const GoogleLoginButton = () => {
  const { data: session } = useSession();

  return (
    <Button
      onClick={() =>
        signIn("google", {
          callbackUrl: window.location.href,
        })
      }
    >
      signin
    </Button>
  );
};

export default GoogleLoginButton;
