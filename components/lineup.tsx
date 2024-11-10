import { Lineup as LineupType } from "@prisma/client";
import React from "react";
import Typography from "./typography";
import { prisma } from "@/lib/prisma/prisma";
import PositonIndicator from "./position-indicator";

interface LineupProps {
  matchId: string;
}

const Lineup: React.FC<LineupProps> = async ({ matchId }) => {
  const lineup = await prisma.lineup.findMany({
    where: { matchId },
    include: { player: true },
  });

  if (!lineup)
    return (
      <Typography variant="p-gray" className="[&:not(:first-child)]:mt-0">
        Der Mannschaftsführer hat noch keine Aufstellung ausgewählt.
      </Typography>
    );
  return (
    <div className="flex gap-2 flex-col">
      {lineup.map((lineup) => (
        <PositonIndicator position={lineup.position}>
          {lineup.player.firstName}
        </PositonIndicator>
      ))}
    </div>
  );
};

export default Lineup;
