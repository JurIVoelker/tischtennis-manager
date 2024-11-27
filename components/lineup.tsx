import React from "react";
import Typography from "./typography";
import { prisma } from "@/lib/prisma/prisma";
import PositonIndicator from "./position-indicator";
import { getPlayerName } from "@/lib/stringUtils";

interface LineupProps {
  matchId: string;
}

const Lineup: React.FC<LineupProps> = async ({ matchId }) => {
  const lineups = await prisma.lineup.findMany({
    where: { matchId },
    include: { player: true },
  });

  if (!lineups || !lineups.length)
    return (
      <Typography variant="p-gray" className="leading-0 mt-1">
        Der Mannschaftsführer hat noch keine Aufstellung ausgewählt.
      </Typography>
    );
  return (
    <div className="flex gap-2 flex-col mt-2">
      {lineups.map((lineup) => (
        <PositonIndicator position={lineup.position} key={lineup.id}>
          {getPlayerName(
            lineup.player,
            lineups.map((l) => l.player)
          )}
        </PositonIndicator>
      ))}
    </div>
  );
};

export default Lineup;
