import { UNKNOWN_ERROR } from "@/constants/APIError";
import { API_POST_PLAYERS_SCHEMA } from "@/constants/zodSchemaConstants";
import { asyncLog } from "@/lib/logUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["leader:own"],
    API_POST_PLAYERS_SCHEMA
  );

  if (response) return response;

  const {
    clubSlug,
    teamSlug,
    players,
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

      const createdPlayers = await tx.player.createManyAndReturn({
        data: players.map(
          (player: { firstName: string; lastName: string }) => ({
            firstName: player.firstName,
            lastName: player.lastName,
            teamId,
          })
        ),
      });

      let playerTeamPositionCount = await tx.playerTeamPosition.count({
        where: { teamId },
      });

      await tx.playerTeamPosition.createMany({
        data: createdPlayers.map((player) => ({
          playerId: player.id,
          teamId,
          position: playerTeamPositionCount++,
        })),
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
    `/${clubSlug}/${teamSlug}/login`,
    `/${clubSlug}/${teamSlug}/spieler/sortieren`,
    `/${clubSlug}/${teamSlug}/spieler/verwalten`,
    ...addPlayerTeamPaths,
    ...lineupPaths,
  ]);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
