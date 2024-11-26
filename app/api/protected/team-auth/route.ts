import { handlePrismaError, prisma } from "@/lib/prisma/prisma";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic"; // defaults to auto

type AllTokensType = string[];

export interface GetTeamAuthResponseInterface {
  token: string | null;
  allTokens: AllTokensType;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const clubSlug = searchParams.get("clubSlug");
  const teamSlug = searchParams.get("teamSlug");

  if (!clubSlug || !teamSlug) {
    return new Response(`clubSlug and teamSlug must be defined`, {
      status: 400,
    });
  }

  let club;
  try {
    club = await prisma.club.findFirst({
      where: {
        slug: clubSlug,
      },
      include: {
        teams: {
          include: {
            teamAuth: true,
          },
        },
      },
    });
  } catch (error) {
    handlePrismaError(error);
  }

  if (!club)
    return new Response("not found", {
      status: 404,
    });

  let teamAuthToken = null;
  const allTokens: AllTokensType = [];
  club.teams.forEach((team) => {
    if (team.slug === teamSlug && team.teamAuth) {
      teamAuthToken = team.teamAuth?.token;
      allTokens.push(team.teamAuth?.token);
    }
  });
  if (!teamAuthToken && !allTokens.length)
    return new Response("team has no token", {
      status: 404,
    });

  return new Response(JSON.stringify({ token: teamAuthToken, allTokens }));
}
