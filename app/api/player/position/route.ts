import { UNKNOWN_ERROR } from "@/constants/APIError";
import { API_PUT_PLAYER_POSITIONS_SCHEMA } from "@/constants/zodSchemaConstants";
import { asyncLog } from "@/lib/logUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["leader:own"],
    API_PUT_PLAYER_POSITIONS_SCHEMA
  );

  if (response) return response;

  const {
    clubSlug,
    teamSlug,
    playerIds,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

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
          teamPosition: true,
          players: true,
        },
      });

      if (!team?.id) throw new Error("Team not found");
      if (
        playerIds.some(
          (playerId: string) => !team.players.some((p) => p.id === playerId)
        )
      ) {
        throw new Error("Some player is not part of team");
      }

      const missingPlayers = team.players.filter(
        (p) => !playerIds.includes(p.id)
      );

      const teamPosition = team.teamPosition;
      for (const { id } of teamPosition) {
        await tx.playerTeamPosition.delete({
          where: {
            id,
          },
        });
      }

      for (let i = 0; i < playerIds.length; i++) {
        await tx.playerTeamPosition.create({
          data: {
            position: i,
            playerId: playerIds[i],
            teamId: team.id,
          },
        });
      }

      for (let i = 0; i < missingPlayers.length; i++) {
        await tx.playerTeamPosition.create({
          data: {
            position: playerIds.length + i,
            playerId: missingPlayers[i].id,
            teamId: team.id,
          },
        });
      }
    })
    .catch((error) => {
      if (error.message) {
        asyncLog(
          "error",
          `Error while creating player position: ${error?.message}`
        );
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
    `/${clubSlug}/${teamSlug}/login`,
    ...addPlayerTeamPaths,
    ...lineupPaths,
  ]);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
