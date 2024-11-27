"use client";
import { getPlayerName } from "@/lib/stringUtils";
import PositonIndicator from "../position-indicator";
import React, { useEffect, useState } from "react";
import { LineupWithPlayers } from "@/types/prismaTypes";
import { getUserData } from "@/lib/localstorageUtils";

interface LineupChildProps {
  lineups: LineupWithPlayers[];
  teamSlug: string;
}

const LineupChild: React.FC<LineupChildProps> = ({ lineups, teamSlug }) => {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const teamUserId = getUserData()[teamSlug]?.id;
    if (teamUserId) setUserId(teamUserId);
  }, [teamSlug]);
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
