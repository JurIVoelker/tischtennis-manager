"use client";
import { getPlayerName } from "@/lib/stringUtils";
import PositonIndicator from "../position-indicator";
import React, { useEffect, useState } from "react";
import { LineupWithPlayers } from "@/types/prismaTypes";
import { getUserData } from "@/lib/localstorageUtils";
import Typography from "../typography";
import { useIsPermitted } from "@/hooks/use-has-permission";
import Link from "next/link";

interface LineupChildProps {
  lineups: LineupWithPlayers[];
  teamSlug: string;
}

const LineupChild: React.FC<LineupChildProps> = ({ lineups, teamSlug }) => {
  const [userId, setUserId] = useState<string>("");
  const isAddLineupLinkVisible = useIsPermitted(
    "view:add-lineup-in-game-card-body"
  );

  useEffect(() => {
    const teamUserId = getUserData()[teamSlug]?.id;
    if (teamUserId) setUserId(teamUserId);
  }, [teamSlug]);

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
              <Link href={`./${teamSlug}/`} className="underline ">
                Hier klicken um eine Aufstellung zu wählen.
              </Link>
            </Typography>
          </>
        )}
      </>
    );

  return (
    <>
      {lineups.map((lineup) => (
        <PositonIndicator
          position={lineup.position}
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
