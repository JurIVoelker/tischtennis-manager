import { INVALID_TOKEN_ERROR, UNKNOWN_ERROR } from "@/constants/APIError";
import {
  API_PUT_LINEUP_SCHEMA,
  validateSchema,
} from "@/constants/zodSchemaConstants";
import { getLeaderData, handleGetBody } from "@/lib/APIUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const {
    success: isBodySuccess,
    body,
    responseReturnValue: invalidBodyResponse,
  } = await handleGetBody(request);
  if (!isBodySuccess) return invalidBodyResponse;

  const {
    success: isSchemaSuccess,
    responseReturnValue: invalidSchemaResponse,
  } = await validateSchema(API_PUT_LINEUP_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    clubSlug,
    teamSlug,
    playerIds,
    matchId,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  const loggedinUserData = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { email } = loggedinUserData || {};
  let isTeamLeader = false;
  if (email) {
    isTeamLeader = (await getLeaderData(clubSlug, teamSlug, email))
      .isTeamLeader;
  }

  if (!isTeamLeader) {
    return new Response(INVALID_TOKEN_ERROR, { status: 401 });
  }

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
