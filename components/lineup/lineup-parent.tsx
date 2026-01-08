import React from "react";
import { prisma } from "@/lib/prisma/prisma";
import LineupChild from "./lineup-child";
import { getTeamBaseName } from "@/lib/teamUtils";
import { LineupWithPlayers } from "@/types/prismaTypes";

interface LineupProps {
  matchId: string;
  teamSlug: string;
}

const Lineup: React.FC<LineupProps> = async ({ matchId, teamSlug }) => {
  const lineups = await prisma.lineup.findMany({
    where: { matchId },
    include: { player: true },
  });

  const baseName = getTeamBaseName(teamSlug.replaceAll("-", " "));

  const getPriority = (lineup: LineupWithPlayers) => {
    return lineup?.player?.positionPriority?.[baseName] || 999;
  };

  const orderedLineup = lineups.sort((a, b) => getPriority(a) - getPriority(b));

  return (
    <div className="flex gap-2 flex-col mt-1">
      <LineupChild
        lineups={orderedLineup}
        teamSlug={teamSlug}
        matchId={matchId}
      />
    </div>
  );
};

export default Lineup;
