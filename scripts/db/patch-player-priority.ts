import { getPriority } from "@/lib/player";
import { prisma } from "@/lib/prisma/prisma";
import { getTeamIndex } from "@/lib/romanUtils";
import { emptyPosition, getTeamBaseName } from "@/lib/teamUtils";
import { Player } from "@prisma/client";
import "dotenv/config";

const TT_API_KEY = "y2akm5yayts0sdnkcvoukzb8zds2c52p5efpfltpf775zx3t50stldb6r05wbyw1"

if (!TT_API_KEY) {
  throw new Error("Missing TT_API_KEY");
}


export type TTApiPlayer = {
  name: string;
  QTTR: number;
  position: number;
}

export type TTApiTeam = {
  teamName: string;
  players: TTApiPlayer[];
};


type TTApiPlayersReturnType =
  {
    playerData: TTApiTeam[];
    meta: {
      id: number;
      expiresAt: string;
    };
  };


export async function fetchPlayers() {
  const matchesPromise = await fetch(
    "https://tt-api.ttc-klingenmuenster.de/api/v1/players",
    {
      headers: {
        "Content-Type": "application/json",
        ...(TT_API_KEY && { Authorization: TT_API_KEY }),
      },
      cache: "no-store",
    }
  );
  const matchData = (await matchesPromise.json()) as TTApiPlayersReturnType;
  return matchData;
}


console.info("Starting player priority patch script");



(async () => {
  const playerData = await fetchPlayers();
  const fetchedTeams = playerData.playerData

  const unknownPlayers: Player[] = []

  const existingPlayers = await prisma.player.findMany({
    include: { team: true },
    where: {
      positionPriority: {
        equals: emptyPosition
      }
    }
  });

  console.log(existingPlayers.length, "players found in database");

  existingPlayers.forEach(async (player) => {
    let ttApiPlayer = null;
    let teamIndex = 0;
    let baseName = "";

    for (const team of fetchedTeams) {
      const foundPlayer: TTApiPlayer | undefined = team.players.find((p) => p.name.toLowerCase() === `${player.firstName.toLowerCase()} ${player.lastName.toLowerCase()}` && getTeamBaseName(team.teamName) === getTeamBaseName(player.team.name));
      if (foundPlayer) {
        ttApiPlayer = foundPlayer;
        teamIndex = getTeamIndex(team.teamName);
        baseName = getTeamBaseName(team.teamName);
        break;
      }
    }
    if (ttApiPlayer) {
      const positionPriorityValue = getPriority(ttApiPlayer, teamIndex);
      const positionPriority = { ...emptyPosition, [baseName]: positionPriorityValue };
      console.info(`Found player ${player.firstName} ${player.lastName}. Updating positionPriority to ${baseName}: ${positionPriorityValue}`);
      await prisma.player.update({
        where: { id: player.id },
        data: { positionPriority },
      })
    } else {
      console.error(`Could not find player ${player.firstName} ${player.lastName} in fetched data (${player.team.name})`);
      unknownPlayers.push(player);
    }
  });
})();


