"use client";
import { Player } from "@prisma/client";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import Typography from "./typography";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Copy01Icon, Logout02Icon, PencilEdit02Icon } from "hugeicons-react";
import Link from "next/link";
import { useIsPermitted } from "@/hooks/use-has-permission";
import { useEffect, useState } from "react";
import { getUserData, setUserData } from "@/lib/localstorageUtils";
import { getPlayerName } from "@/lib/stringUtils";
import { getAPI } from "@/lib/APIUtils";
import { toast } from "@/hooks/use-toast";
import { ConfirmModal } from "./popups/confirm-modal";

interface PlayersCardProps {
  players: Player[] | undefined;
  className?: string;
  clubSlug: string;
  teamSlug: string;
}

const PlayersCard = ({
  players,
  className,
  clubSlug,
  teamSlug,
}: PlayersCardProps) => {
  const isOptionsVisible = useIsPermitted("view:players-card-options");
  const [userId, setUserId] = useState<string>("");
  const [inviteToken, setInviteToken] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLeaveTeam = () => {
    setUserData({ [teamSlug]: undefined });
    window.location.reload();
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
    const fetchInviteToken = async () => {
      try {
        const data = await getAPI("/api/invite-token", {
          query: { clubSlug, teamSlug },
        });
        const { token } = data || {};
        if (token) setInviteToken(token);
      } catch {}
    };
    const teamUserId = getUserData()[teamSlug]?.id;
    if (teamUserId) setUserId(teamUserId);
    fetchInviteToken();
  }, [teamSlug, clubSlug]);

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex justify-between mb-4 items-center h-10">
        <Typography variant="h4">Spieler</Typography>
        {isOptionsVisible && (
          <Button variant="secondary" size="icon-lg" asChild>
            <Link href={`/${clubSlug}/${teamSlug}/spieler/verwalten`}>
              <PencilEdit02Icon strokeWidth={2} />
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {!players?.length && (
          <Typography variant="p-gray">Keine Spieler gefunden</Typography>
        )}
        {players &&
          players.map((player) => (
            <Badge
              variant={userId === player.id ? "default" : "secondary"}
              key={player.id}
            >{`${
              userId === player.id ? "Du" : getPlayerName(player, players)
            }`}</Badge>
          ))}
      </div>
      {(inviteToken || userId) && (
        <div className="flex flex-col gap-2 md:gap-4 mt-4 md:flex-row">
          {inviteToken && (
            <Button onClick={handleClickCopy} className="w-full">
              <Copy01Icon strokeWidth={2} />
              Einladungslink kopieren
            </Button>
          )}
          {userId && (
            <Button className="w-full" onClick={() => setModalOpen(true)}>
              <Logout02Icon strokeWidth={2} />
              Mannschaft verlassen
            </Button>
          )}
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleLeaveTeam}
        title="Mannschaft verlassen"
        description="Bist du sicher, dass du die Mannschaft verlassen möchtest?"
      />
    </Card>
  );
};

export default PlayersCard;
