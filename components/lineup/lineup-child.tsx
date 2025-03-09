"use client";
import { getPlayerName } from "@/lib/stringUtils";
import PositonIndicator from "../position-indicator";
import React from "react";
import { LineupWithPlayers } from "@/types/prismaTypes";
import Typography from "../typography";
import { useIsPermitted } from "@/hooks/use-has-permission";
import Link from "next/link";
import { useUserStore } from "@/store/store";

interface LineupChildProps {
  lineups: LineupWithPlayers[];
  teamSlug: string;
  matchId: string;
}

const LineupChild: React.FC<LineupChildProps> = ({
  lineups,
  teamSlug,
  matchId,
}) => {
  const isAddLineupLinkVisible = useIsPermitted(
    "view:add-lineup-in-game-card-body"
  );

  const { joinedTeams } = useUserStore();
  const userId = joinedTeams.find(
    (team) => team.teamSlug === teamSlug
  )?.playerId;

  if (!lineups || !lineups.length)
    return (
      <>
        {!isAddLineupLinkVisible && (
          <Typography variant="p-gray" className="leading-0 mt-1">
            Der Mannschaftsführer hat noch keine Aufstellung ausgewählt.
          </Typography>
        )}
        {isAddLineupLinkVisible && (
          <>
            <Typography variant="p-gray" className="leading-0 mt-1">
              {"Du hast noch keine Aufstellung ausgewählt. "}
              <Link
                href={`./${teamSlug}/spiel/aufstellung/verwalten/${matchId}`}
                className="underline "
              >
                Hier klicken um eine Aufstellung zu wählen.
              </Link>
            </Typography>
          </>
        )}
      </>
    );

  return (
    <>
      {lineups.map((lineup, i) => (
        <PositonIndicator
          position={i + 1}
          key={lineup.id}
          variant={userId === lineup.player.id ? "black" : "light"}
        >
          {userId === lineup.player.id
            ? "Du"
            : getPlayerName(
                lineup.player,
                lineups.map((l) => l.player)
              )}
        </PositonIndicator>
      ))}
    </>
  );
};

export default LineupChild;
