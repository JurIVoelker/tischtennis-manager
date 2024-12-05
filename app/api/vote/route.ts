import { UNKNOWN_ERROR } from "@/constants/APIError";
import {
  API_VOTE_SCHEMA,
  validateSchema,
} from "@/constants/zodSchemaConstants";
import { handleGetBody, hasLeaderPermission } from "@/lib/APIUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const {
    success: isBodySuccess,
    body,
    responseReturnValue: invalidBodyResponse,
  } = await handleGetBody(request);
  if (!isBodySuccess) return invalidBodyResponse;

  const {
    success: isSchemaSuccess,
    responseReturnValue: invalidSchemaResponse,
  } = await validateSchema(API_VOTE_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  // @ts-expect-error zod validation ensures that body is defined
  const { clubSlug, teamSlug, playerId, matchId, vote } = body || {};

  const { success: isLeaderSuccess, responseReturnValue: leaderResponse } =
    await hasLeaderPermission(clubSlug, teamSlug, request);

  if (!isLeaderSuccess) return leaderResponse;

  const club = await prisma.club.findUnique({
    where: {
      slug: clubSlug,
    },
    include: {
      teams: {
        include: {
          matches: {
            where: {
              id: matchId,
            },
          },
          players: {
            where: {
              id: playerId,
            },
            include: {
              matchAvailabilityVotes: {
                where: {
                  matchId: matchId,
                },
              },
            },
          },
        },
        where: {
          slug: teamSlug,
        },
      },
    },
  });

  const response = await prisma
    .$transaction(async (tx) => {
      // @ts-expect-error zod validation ensures that club is defined
      for (const vote of club?.teams[0]?.players[0]?.matchAvailabilityVotes) {
        await tx.matchAvailabilityVote.delete({
          where: {
            id: vote.id,
          },
        });
      }
      const res = await tx.matchAvailabilityVote.create({
        data: {
          availability: vote,
          matchId,
          playerId,
        },
      });

      return res?.availability || "unknown";
    })
    .catch(() => {
      return new Response(JSON.stringify([{ message: UNKNOWN_ERROR }]), {
        status: 500,
      });
    });

  if (typeof response === "string") {
    revalidatePaths([
      `/${clubSlug}/${teamSlug}`,
      `/${clubSlug}/${teamSlug}/spiel/aufstellung/verwalten/${matchId}`,
    ]);
    return new Response(JSON.stringify({ data: response }), { status: 200 });
  } else {
    return response;
  }
}
