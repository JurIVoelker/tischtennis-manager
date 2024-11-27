import React from "react";
import Typography from "../typography";
import { prisma } from "@/lib/prisma/prisma";
import LineupChild from "./lineup-child";

interface LineupProps {
  matchId: string;
  teamSlug: string;
}

const Lineup: React.FC<LineupProps> = async ({ matchId, teamSlug }) => {
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
      <LineupChild lineups={lineups} teamSlug={teamSlug} />
    </div>
  );
};

export default Lineup;
