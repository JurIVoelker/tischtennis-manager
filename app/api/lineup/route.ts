import { UNKNOWN_ERROR } from "@/constants/APIError";
import { API_PUT_LINEUP_SCHEMA } from "@/constants/zodSchemaConstants";
import { asyncLog } from "@/lib/logUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["leader:own"],
    API_PUT_LINEUP_SCHEMA
  );

  if (response) return response;

  const {
    clubSlug,
    teamSlug,
    playerIds,
    matchId,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  const transactionResult = await prisma
    .$transaction(async (tx) => {
      const uniquePlayerIds = new Set(playerIds);
      if (uniquePlayerIds.size !== playerIds.length) {
        throw new Error("Duplicate playerId found");
      }
      const match = await tx.match.findUnique({
        where: {
          id: matchId,
          AND: {
            team: {
              slug: teamSlug,
              club: {
                slug: clubSlug,
              },
            },
          },
        },
        include: {
          lineups: true,
          team: {
            include: {
              players: true,
            },
          },
        },
      });

      if (!match?.id) throw new Error("Match not found");

      await tx.lineup.deleteMany({
        where: {
          matchId,
        },
      });

      await tx.lineup.createMany({
        data: playerIds.map((playerId: string, index: number) => ({
          playerId,
          matchId,
          position: index,
        })),
      });
    })
    .catch((error) => {
      if (error.message) {
        asyncLog("error", `Error while putting lineup: ${error?.message}`);
        return new Response(error.message, { status: 400 });
      }
      return new Response(UNKNOWN_ERROR, { status: 500 });
    });

  if (transactionResult instanceof Response) {
    return transactionResult;
  }

  revalidatePaths([
    `/${clubSlug}/${teamSlug}`,
    `/${clubSlug}/${teamSlug}/spiel/aufstellung/verwalten/${matchId}`,
  ]);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
