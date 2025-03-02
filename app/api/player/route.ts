import { UNKNOWN_ERROR } from "@/constants/APIError";
import {
  API_DELETE_PLAYER_SCHEMA,
  API_POST_PLAYER_SCHEMA,
} from "@/constants/zodSchemaConstants";
import { asyncLog } from "@/lib/logUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["leader:own"],
    API_DELETE_PLAYER_SCHEMA
  );

  if (response) return response;

  const {
    clubSlug,
    teamSlug,
    playerId,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  // TODO security check playerId

  const transactionResult = await prisma
    .$transaction(async (tx) => {
      const team = await tx.team.findUnique({
        where: {
          slug: teamSlug,
          club: {
            slug: clubSlug,
          },
        },
        include: {
          players: true,
          teamPosition: {
            where: {
              playerId: playerId,
            },
          },
        },
      });

      if (!team?.id) throw new Error("Team not found");
      if (!team.players.some((p) => p.id === playerId)) {
        throw new Error("Player is not part of team");
      }

      const player = await tx.player.findUnique({
        where: {
          id: playerId,
        },
        include: {
          teamPosition: true,
        },
      });

      const lineups = await tx.lineup.findMany({
        where: {
          player: {
            id: playerId,
          },
        },
      });

      if (
        Array.isArray(player?.teamPosition) &&
        player?.teamPosition.length >= 1
      ) {
        const teamPosition = player.teamPosition[0].id;
        await tx.playerTeamPosition.delete({
          where: {
            id: teamPosition,
          },
        });
      }

      for (const lineup of lineups) {
        await tx.lineup.delete({
          where: {
            id: lineup.id,
          },
        });
      }

      const votes = await tx.matchAvailabilityVote.findMany({
        where: {
          player: {
            id: playerId,
          },
        },
      });

      for (const vote of votes) {
        await tx.matchAvailabilityVote.delete({
          where: {
            id: vote.id,
          },
        });
      }

      await tx.player.delete({
        where: {
          id: playerId,
        },
      });
    })
    .catch((error) => {
      if (error.message) {
        asyncLog("error", `Error while deleting player: ${error?.message}`);
        return new Response(error.message, { status: 400 });
      }
      return new Response(UNKNOWN_ERROR, { status: 500 });
    });
  if (transactionResult instanceof Response) {
    return transactionResult;
  }

  const allMatches = await prisma.match.findMany({
    where: {
      team: {
        slug: teamSlug,
        club: {
          slug: clubSlug,
        },
      },
    },
  });

  const lineupPaths = allMatches.map(
    (match) =>
      `/${clubSlug}/${teamSlug}/spiel/aufstellung/verwalten/${match.id}`
  );

  const allTeamSlugs = await prisma.team.findMany({
    where: {
      club: {
        slug: clubSlug,
      },
    },
    select: {
      slug: true,
    },
  });

  const addPlayerTeamPaths = allTeamSlugs.map(
    (team) => `/${clubSlug}/${team.slug}/spieler/hinzufuegen`
  );

  revalidatePaths([
    `/${clubSlug}/${teamSlug}`,
    `/${clubSlug}/${teamSlug}/login`,
    `/${clubSlug}/${teamSlug}/spieler/sortieren`,
    `/${clubSlug}/${teamSlug}/spieler/verwalten`,
    ...addPlayerTeamPaths,
    ...lineupPaths,
  ]);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["leader:own"],
    API_POST_PLAYER_SCHEMA
  );

  if (response) return response;

  const {
    clubSlug,
    teamSlug,
    firstName,
    lastName,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  const transactionResult = await prisma
    .$transaction(async (tx) => {
      const teamId =
        (
          await tx.team.findFirst({
            where: {
              slug: teamSlug,
              club: {
                slug: clubSlug,
              },
            },
            select: {
              id: true,
            },
          })
        )?.id || "";

      if (!teamId) throw new Error("Team not found");

      const playerId = (
        await tx.player.create({
          data: {
            firstName,
            lastName,
            teamId,
          },
        })
      ).id;

      const playerTeamPositionCount = await tx.playerTeamPosition.count({
        where: { teamId },
      });

      await tx.playerTeamPosition.create({
        data: {
          playerId,
          teamId,
          position: playerTeamPositionCount,
        },
      });
    })
    .catch((error) => {
      if (error.message) {
        asyncLog("error", `Error while creating player: ${error?.message}`);
        return new Response(error.message, { status: 400 });
      }
      return new Response(UNKNOWN_ERROR, { status: 500 });
    });
  if (transactionResult instanceof Response) {
    return transactionResult;
  }

  const allMatches = await prisma.match.findMany({
    where: {
      team: {
        slug: teamSlug,
        club: {
          slug: clubSlug,
        },
      },
    },
  });

  const lineupPaths = allMatches.map(
    (match) =>
      `/${clubSlug}/${teamSlug}/spiel/aufstellung/verwalten/${match.id}`
  );

  const allTeamSlugs = await prisma.team.findMany({
    where: {
      club: {
        slug: clubSlug,
      },
    },
    select: {
      slug: true,
    },
  });

  const addPlayerTeamPaths = allTeamSlugs.map(
    (team) => `/${clubSlug}/${team.slug}/spieler/hinzufuegen`
  );

  revalidatePaths([
    `/${clubSlug}/${teamSlug}`,
    `/${clubSlug}/${teamSlug}/spieler/sortieren`,
    `/${clubSlug}/${teamSlug}/spieler/verwalten`,
    ...addPlayerTeamPaths,
    ...lineupPaths,
  ]);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
