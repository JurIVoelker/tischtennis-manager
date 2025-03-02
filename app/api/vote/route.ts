import { UNKNOWN_ERROR } from "@/constants/APIError";
import { API_VOTE_SCHEMA } from "@/constants/zodSchemaConstants";
import { asyncLog } from "@/lib/logUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import {
  validateMatchId,
  validatePlayerId,
  validateRequest,
} from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["user:own", "leader:own"],
    API_VOTE_SCHEMA
  );

  if (response) return response;

  // @ts-expect-error zod validation ensures that body is defined
  const { clubSlug, teamSlug, playerId, matchId, vote } = body || {};

  let res = await validateMatchId(clubSlug, teamSlug, matchId);
  if (!res.success)
    return new Response(JSON.stringify(res.error), { status: 404 });

  res = await validatePlayerId(clubSlug, teamSlug, playerId);
  if (!res.success)
    return new Response(JSON.stringify(res.error), { status: 404 });

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

  const transactionResult = await prisma
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
    .catch((error) => {
      asyncLog(
        "error",
        `Error while creating match availability vote: ${error?.message}`
      );
      return new Response(JSON.stringify([{ message: UNKNOWN_ERROR }]), {
        status: 500,
      });
    });

  if (typeof transactionResult === "string") {
    revalidatePaths([
      `/${clubSlug}/${teamSlug}`,
      `/${clubSlug}/${teamSlug}/spiel/aufstellung/verwalten/${matchId}`,
    ]);
    return new Response(JSON.stringify({ data: transactionResult }), {
      status: 200,
    });
  } else {
    return transactionResult;
  }
}
