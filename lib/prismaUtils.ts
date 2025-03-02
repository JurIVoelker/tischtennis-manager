import { Player } from "@prisma/client";
import { prisma } from "./prisma/prisma";
import { LineupWithPlayers, MatchWithLineup } from "@/types/prismaTypes";

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
    // asyncLog(
    //   "error",
    //   `Team with id ${teamId} from has players without positions`
    // );
  }

  players.push(...(playersWithoutTeamPosition?.players || []));
  return players;
};

export const sortLineupsOfMatch = (
  match: MatchWithLineup,
  players: Player[]
): MatchWithLineup => {
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
  matches: MatchWithLineup[],
  players: Player[]
): MatchWithLineup[] => {
  return matches.map((match) => sortLineupsOfMatch(match, players));
};

export const validateLeaderId = async (clubSlug: string, leaderId: string) => {
  const club = (await prisma.club.findFirst({
    where: { slug: clubSlug },
    include: {
      teams: {
        include: {
          teamLeader: {
            where: { id: leaderId },
          },
        },
      },
    },
  })) || { teams: [] };

  const teamLeader = club?.teams[0]?.teamLeader[0];

  if (teamLeader?.id !== leaderId) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ ok: false }), { status: 404 }),
    };
  }

  return {
    ok: true,
    response: new Response(JSON.stringify({ ok: true }), { status: 200 }),
  };
};

export const validateMatchId = async (clubSlug: string, matchId: string) => {
  const club = (await prisma.club.findFirst({
    where: { slug: clubSlug },
    include: {
      teams: {
        include: {
          matches: {
            where: { id: matchId },
          },
        },
      },
    },
  })) || { teams: [] };

  const someIdValid = club.teams.some((team) =>
    team.matches.length > 0 ? team.matches[0].id === matchId : null
  );

  if (!someIdValid) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ ok: false }), { status: 404 }),
    };
  }

  return {
    ok: true,
    response: false,
  };
};

export const validateTeamId = async (clubSlug: string, teamId: string) => {
  const club = (await prisma.club.findFirst({
    where: { slug: clubSlug },
    include: {
      teams: {
        where: { id: teamId },
      },
    },
  })) || { teams: [] };

  const team = club?.teams[0];

  if (team?.id !== teamId) {
    return {
      ok: false,
      response: new Response(JSON.stringify({ ok: false }), { status: 404 }),
    };
  }

  return {
    ok: true,
    response: new Response(JSON.stringify({ ok: true }), { status: 200 }),
  };
};
