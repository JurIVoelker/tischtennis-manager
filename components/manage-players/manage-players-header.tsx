"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft01Icon, Copy01Icon } from "hugeicons-react";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getAPI } from "@/lib/APIUtils";
import { toast } from "@/hooks/use-toast";
import Typography from "../typography";

interface ManagePlayersHeaderProps {
  clubSlug: string;
  teamSlug: string;
}

const ManagePlayersHeader: React.FC<ManagePlayersHeaderProps> = ({
  clubSlug,
  teamSlug,
}) => {
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const showErrorToast = () => {
    toast({
      title: "Fehler beim Laden des Einladungslinks",
      description: (
        <div className="mt-2 w-[340px] flex gap-2">
          <Typography variant="p" className="leading-1">
            Beim Laden des Einladungslinks ist ein Fehler aufgetreten.
            Möglicherweise hast du keine Berechtigung, um diesen Link zu sehen.
          </Typography>
        </div>
      ),
    });
  };

  const fetchInviteToken = async () => {
    try {
      const data = await getAPI("/api/invite-token", { clubSlug, teamSlug });
      const { token } = data || {};
      if (token) setInviteToken(token);
      else {
        showErrorToast();
      }
    } catch {
      showErrorToast();
    }
  };

  const handleClickCopy = () => {
    if (inviteToken) {
      const inviteLink = `${window.location.origin}/${clubSlug}/${teamSlug}/login?inviteToken=${inviteToken}`;
      navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Einladungslink kopiert",
        description: (
          <div className="mt-2 w-[340px] flex gap-2">
            <Typography variant="p" className="leading-1">
              Der Einladungslink wurde erfolgreich in die Zwischenablage
              kopiert.
            </Typography>
          </div>
        ),
      });
    }
  };

  useEffect(() => {
    fetchInviteToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex gap-2 ">
        <Button variant="outline" asChild>
          <Link href="../">
            <ArrowLeft01Icon />
            Zurück
          </Link>
        </Button>
        <Button
          className="w-full"
          disabled={!Boolean(inviteToken)}
          onClick={handleClickCopy}
        >
          {inviteToken && (
            <>
              <Copy01Icon />
              Einladungslink kopieren
            </>
          )}
          {!inviteToken && (
            <>
              <Loader2 className="animate-spin" />
              Einladungslink laden
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default ManagePlayersHeader;
