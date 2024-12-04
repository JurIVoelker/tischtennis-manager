import {
  BODY_NOT_DEFINED_ERROR,
  BODY_NOT_JSON_ERROR,
  INVALID_TOKEN_ERROR,
  MATCH_NOT_FOUND_ERROR,
  PLAYER_NOT_FOUND_ERROR,
  UNKNOWN_ERROR,
} from "@/constants/APIError";
import { getLeaderData, getValidToken } from "@/lib/APIUtils";
import { getAuthCookies } from "@/lib/cookieUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidateAfterVote } from "@/lib/revalidateUtils";
import { matchAvailablilites } from "@/types/prismaTypes";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  let body = null;
  try {
    body = await request.json();
  } catch {
    return new Response(BODY_NOT_JSON_ERROR, {
      status: 400,
    });
  }

  if (!body) {
    return new Response(BODY_NOT_DEFINED_ERROR, { status: 400 });
  }

  const { clubSlug, teamSlug, playerId, matchId, vote } = body || {};

  const schema = z.object({
    clubSlug: z.string(),
    teamSlug: z.string(),
    playerId: z.string(),
    matchId: z.string(),
    vote: z.enum([...matchAvailablilites] as [string, ...string[]]),
  });

  const result = schema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify(result.error?.issues || { error: "unknown" }),
      {
        status: 400,
      }
    );
  }

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
    const { token: userToken } = getAuthCookies(request, clubSlug, teamSlug);
    const { token } = await getValidToken(clubSlug, teamSlug);

    if (token !== userToken)
      return new Response(INVALID_TOKEN_ERROR, { status: 401 });
  }

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

  if (!club?.teams[0]?.matches[0])
    return new Response(MATCH_NOT_FOUND_ERROR, { status: 404 });

  if (club?.teams[0]?.players[0]?.id !== playerId)
    return new Response(PLAYER_NOT_FOUND_ERROR, { status: 404 });

  const response = await prisma
    .$transaction(async (tx) => {
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
      return new Response(UNKNOWN_ERROR, { status: 500 });
    });

  if (typeof response === "string") {
    revalidateAfterVote(clubSlug, teamSlug, matchId);
    return new Response(JSON.stringify({ data: response }), { status: 200 });
  } else {
    return response;
  }
}
