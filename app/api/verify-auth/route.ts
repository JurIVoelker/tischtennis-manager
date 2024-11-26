import { prisma } from "@/lib/prisma/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { email } = token || {};
  if (!email) return new Response("Forbidden", { status: 403 });

  let teamLeaders;
  try {
    teamLeaders = await prisma.teamLeader.findMany({
      where: {
        email,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }

  const data: { leaderAt: { clubName: string; teamName: string }[] } = {
    leaderAt: [],
  };

  for (const teamLeader of teamLeaders) {
    const team = await prisma.team.findFirst({
      where: {
        id: teamLeader.teamId,
      },
    });

    const club = await prisma.club.findFirst({
      where: {
        teams: {
          some: { id: teamLeader.teamId },
        },
      },
    });

    if (club?.slug && team?.slug)
      data.leaderAt.push({
        clubName: club.slug,
        teamName: team.slug,
      });
  }

  return new Response(JSON.stringify({ data }));
}
