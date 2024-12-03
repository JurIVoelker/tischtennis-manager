import { getValidToken } from "@/lib/APIUtils";
import { getAuthCookies } from "@/lib/cookieUtils";
import { prisma } from "@/lib/prisma/prisma";
import { matchAvailablilites } from "@/types/prismaTypes";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  let body = null;
  try {
    body = await request.json();
  } catch {
    return new Response("body must be json", {
      status: 400,
    });
  }

  if (!body) {
    return new Response("body must be defined", { status: 400 });
  }

  const clubSlug = body.clubSlug;
  const teamSlug = body.teamSlug;
  const playerId = body.playerId;
  const matchId = body.matchId;
  const vote = body.vote;

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

  const { token: userToken } = getAuthCookies(request, clubSlug, teamSlug);
  const { token } = await getValidToken(clubSlug, teamSlug);

  if (token !== userToken)
    return new Response("invalid token", { status: 401 });

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
    return new Response("Match not found", { status: 404 });

  if (club?.teams[0]?.players[0]?.id !== playerId)
    return new Response("Player not found", { status: 404 });

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
      return new Response("Error while saving vote", { status: 500 });
    });

  if (typeof response === "string") {
    revalidatePath(`/${clubSlug}/${teamSlug}`);
    return new Response(JSON.stringify({ data: response }), { status: 200 });
  } else {
    return response;
  }
}
