"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Typography from "./typography";
import { useUserStore } from "@/store/store";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Separator } from "./ui/separator";

const IndexLoginManager = () => {
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const { joinedTeams, leaderAt, clubSlug, admin } = useUserStore();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get("error");
    if (errorParam) {
      setError(errorParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const redirectLink =
    joinedTeams?.length > 0
      ? `/${clubSlug}/${joinedTeams[0].teamSlug}`
      : admin === true
        ? `/${clubSlug}/admin/verwalten`
        : leaderAt?.length > 0
          ? `/${leaderAt[0].clubSlug}/${leaderAt[0].teamSlug}`
          : null;

  return (
    <>
      {redirectLink}
      {redirectLink && (
        <>
          <Separator className="my-8" />
          <Typography variant="h4" className="mt-2">
            Bereits eingeloggt
          </Typography>
          <Typography variant="p" className="mt-2">
            Du scheinst bereits eingeloggt zu sein. Möchtest du weitergeleitet
            werden?
          </Typography>
          <Link
            href={redirectLink}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "mt-4 w-full"
            )}
          >
            Weiter
          </Link>
        </>
      )}
      {error}
    </>
  );
};

export default IndexLoginManager;
