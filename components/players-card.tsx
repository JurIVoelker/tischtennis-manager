"use client";
import { Player } from "@prisma/client";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import Typography from "./typography";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { PencilEdit02Icon } from "hugeicons-react";
import Link from "next/link";
import { useIsPermitted } from "@/hooks/use-has-permission";

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
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex justify-between mb-4 items-center h-10">
        <Typography variant="h4">Spieler</Typography>
        {isOptionsVisible && (
          <Button variant="secondary" size="icon-lg" asChild>
            <Link href={`/${clubSlug}/${teamSlug}/spieler/verwalten`}>
              <PencilEdit02Icon />
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
              variant="secondary"
              key={player.id}
            >{`${player.firstName}`}</Badge>
          ))}
      </div>
    </Card>
  );
};

export default PlayersCard;
