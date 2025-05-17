import React from "react";
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

  return (
    <div className="flex gap-2 flex-col mt-1">
      <LineupChild lineups={lineups} teamSlug={teamSlug} matchId={matchId} />
    </div>
  );
};

export default Lineup;
