import { handlePrismaError, prisma } from "@/lib/prisma/prisma";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic"; // defaults to auto

type AuthenticatedTeams = {
  clubSlug: string;
  teamSlug: string;
  email: string;
}[];

export interface GetTeamAuthResponseInterface {
  token: string | null;
  allTokens: AuthenticatedTeams;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const clubSlug = searchParams.get("clubSlug");
  const teamSlug = searchParams.get("teamSlug");
  const email = searchParams.get("email");

  if (!clubSlug || !teamSlug || !email) {
    return new Response(`clubSlug, teamSlug and email must be defined`, {
      status: 400,
    });
  }

  let clubs;
  try {
    clubs = await prisma.club.findMany({
      where: {
        slug: clubSlug,
      },
      include: {
        teams: {
          include: {
            teamLeader: true,
          },
        },
      },
    });
  } catch (error) {
    handlePrismaError(error);
  }

  if (!clubs)
    return new Response("not found", {
      status: 404,
    });

  let isSomeLeader = false;
  let isTeamLeader = false;
  clubs.forEach((club) => {
    club.teams.forEach((team) => {
      team.teamLeader.forEach((teamLeader) => {
        if (teamLeader.email === email) {
          isSomeLeader = true;
          if (team.slug === teamSlug) {
            isTeamLeader = true;
          }
        }
      });
    });
  });

  return new Response(JSON.stringify({ isTeamLeader, isSomeLeader }));
}
