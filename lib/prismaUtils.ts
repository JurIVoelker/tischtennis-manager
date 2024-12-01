import { Player } from "@prisma/client";
import { prisma } from "./prisma/prisma";
import { asyncLog } from "./logUtils";
import {
  LineupWithPlayers,
  MatchWithLineupAndLocation,
} from "@/types/prismaTypes";

export const getOrderedPlayers = async (
  teamId: string | null | undefined
): Promise<Player[]> => {
  if (!teamId) return [];

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

export const sortLineupsOfMatch = (
  match: MatchWithLineupAndLocation,
  players: Player[]
): MatchWithLineupAndLocation => {
  const sortedLineup: LineupWithPlayers[] = [];

  players.forEach((player) => {
    const lineup = match.lineups.find(
      (lineup) => player.id === lineup.playerId
    );
    if (lineup) sortedLineup.push(lineup);
  });

  return { ...match, lineups: sortedLineup };
};

export const sortLineupsOfMatches = (
  matches: MatchWithLineupAndLocation[],
  players: Player[]
): MatchWithLineupAndLocation[] => {
  return matches.map((match) => sortLineupsOfMatch(match, players));
};
