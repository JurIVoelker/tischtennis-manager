"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { GoogleIcon, Mail01Icon } from "hugeicons-react";
import { usePathname } from "next/navigation";
import Typography from "./typography";

interface GoogleLoginButtonProps {
  callbackUrl?: string;
  includeText?: boolean;
  className?: string;
  variant?: "google" | "credentials";
  data?: { email: string; password: string };
}

const LoginButton: React.FC<GoogleLoginButtonProps> = ({
  variant = "google",
  callbackUrl = "",
  includeText = true,
  className = "",
  data = {},
}) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const clubSlug = pathName.split("/")[1];

  const URL =
    callbackUrl ||
    (typeof window !== "undefined" &&
      `${window.location.protocol}//${window.location.host}/${clubSlug}/mannschaftsfuehrer/login/validieren`) ||
    "";

  return (
    <div className={className}>
      {session && (
        <>
          {includeText && (
            <Typography variant="p" className="leading-1 mt-4 mb-2">
              Du bist bereits eingeloggt. Möchtest du dich ausloggen?
            </Typography>
          )}
          <Button onClick={() => signOut()} className="w-full">
            Ausloggen
          </Button>
        </>
      )}
      {!session && (
        <>
          {variant === "google" && (
            <Button
              className="w-full"
              variant="outline"
              onClick={() => {
                signIn("google", {
                  callbackUrl: URL,
                  redirect: true,
                });
              }}
            >
              <GoogleIcon strokeWidth={2} /> Google
            </Button>
          )}
          {variant === "credentials" && (
            <Button
              className="w-full"
              onClick={() => {
                signIn("credentials", {
                  callbackUrl: URL,
                  redirect: true,
                  ...data,
                });
              }}
            >
              <Mail01Icon strokeWidth={2} /> Login
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default LoginButton;
