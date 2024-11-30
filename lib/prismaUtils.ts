import { Player } from "@prisma/client";
import { prisma } from "./prisma/prisma";
import { asyncLog } from "./logUtils";

export const getOrderedPlayers = async (teamId: string): Promise<Player[]> => {
  const playerTeamPositions = await prisma.playerTeamPosition.findMany({
    where: {
      teamId,
    },
    include: {
      player: true,
    },
    orderBy: {
      position: "asc",
    },
  });

  const players = playerTeamPositions.map(
    (playerTeamPosition) => playerTeamPosition.player
  );

  const playersWithoutTeamPosition = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
    include: {
      players: {
        where: {
          teamPosition: {
            none: {},
          },
        },
      },
    },
  });

  if (
    playersWithoutTeamPosition?.players &&
    playersWithoutTeamPosition?.players.length > 0
  ) {
    asyncLog(
      "error",
      `Team with id ${teamId} from has players without positions`
    );
  }

  players.push(...(playersWithoutTeamPosition?.players || []));
  return players;
};
