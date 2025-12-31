"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { buttonVariants } from "./ui/button";
import { HelpCircleIcon, Info } from "lucide-react";
import { AvailabilityVoteWithPlayer } from "@/types/prismaTypes";
import { Cancel01Icon, Tick01Icon } from "hugeicons-react";
import { getPlayerName } from "@/lib/stringUtils";
import { Player } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useIsPermitted } from "@/hooks/use-has-permission";
import { Badge } from "./ui/badge";
import { umami } from "@/lib/umami";

const GameAvailabilityDialog = ({
  matchAvailabilityVotes,
  allPlayers,
}: {
  matchAvailabilityVotes: AvailabilityVoteWithPlayer[];
  allPlayers: Player[];
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isVisible = useIsPermitted("view:game-availability-overview-dialog");
  if (!isVisible) return null;
  const notVotedPlayers = allPlayers.filter(
    (p) => !matchAvailabilityVotes.some((v) => v.playerId === p.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        onClick={() => {
          setIsOpen(true);
          umami()?.track("open-availability-dialog");
        }}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-center"
        )}
        disabled={matchAvailabilityVotes.length === 0}
      >
        {matchAvailabilityVotes.length > 0 ? (
          <>
            <Info />
            Abstimmungen anzeigen ({matchAvailabilityVotes.length})
          </>
        ) : (
          <>Noch keine Abstimmungen</>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Abstimmungen</DialogTitle>
        {matchAvailabilityVotes.length === 0 && (
          <p>Keine Abstimmungen vorhanden.</p>
        )}
        <div className="mt-2 space-y-3">
          {matchAvailabilityVotes.map((vote) => {
            const Icon =
              vote.availability === "available"
                ? Tick01Icon
                : vote.availability === "unavailable"
                  ? Cancel01Icon
                  : HelpCircleIcon;

            const bg =
              vote.availability === "available"
                ? "border text-positive-dark border-positive-border bg-positive-light"
                : vote.availability === "unavailable"
                  ? "border text-negative-dark border-negative-border bg-negative-light"
                  : "border text-neutral-dark border-neutral-border bg-neutral-light";
            return (
              <div
                key={vote.playerId}
                className={`flex justify-between p-2 rounded px-3 items-center ${bg}`}
              >
                <span className="text-sm">{getPlayerName(vote.player)}</span>
                <Icon className="size-5" />
              </div>
            );
          })}
        </div>
        {notVotedPlayers.length > 0 && (
          <div className="mt-3">
            <h2 className="text-base font-semibold">Noch nicht abgestimmt:</h2>
            <div className="flex gap-1.5 flex-wrap mt-2.5">
              {notVotedPlayers.map((player) => (
                <Badge
                  key={player.id}
                  variant="outline"
                  className="bg-secondary/30"
                >
                  {getPlayerName(player)}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GameAvailabilityDialog;
