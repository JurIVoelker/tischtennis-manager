import React from "react";
import { prisma } from "@/lib/prisma/prisma";
import LineupChild from "./lineup-child";
import { getTeamBaseName } from "@/lib/teamUtils";
import { LineupWithPlayers } from "@/types/prismaTypes";
import { umami } from "@/lib/umami";

interface LineupProps {
  matchId: string;
  teamSlug: string;
}

const Lineup: React.FC<LineupProps> = async ({ matchId, teamSlug }) => {
  const lineups = await prisma.lineup.findMany({
    where: { matchId },
    include: { player: true },
    orderBy: {
      position: "asc",
    },
  });

  const baseName = getTeamBaseName(teamSlug.replaceAll("-", " "));

  const getPriority = (lineup: LineupWithPlayers) => {
    // @ts-expect-error positionPriority is JSON field
    const priority = lineup?.player?.positionPriority?.[baseName] || 999;
    if (priority === 999) {
      umami()?.track("missing-position-priority", {
        playerId: lineup.player.id,
        playerName: `${lineup.player.firstName} ${lineup.player.lastName}`,
        teamBaseName: baseName,
        teamSlug,
      });
    }
    return priority;
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
