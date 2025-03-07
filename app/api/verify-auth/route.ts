import { asyncLog } from "@/lib/logUtils";
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
  if (!email) return new Response("Unauthorized", { status: 401 });

  let teamLeaders;
  try {
    teamLeaders = await prisma.teamLeader.findMany({
      where: {
        email: email.toLowerCase(),
      },
    });
  } catch (error) {
    asyncLog(
      "error",
      `Error verifying token (teamLeader): ${JSON.stringify(error)}`
    );
    console.error(error);
  }

  const data: {
    leaderAt: { clubName: string; teamName: string }[];
    admin: boolean;
  } = {
    leaderAt: [],
    admin: false,
  };

  for (const teamLeader of teamLeaders || []) {
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

  try {
    const admin = await prisma.owner.findMany({
      where: {
        email: email.toLowerCase(),
      },
    });
    if (admin.length > 0) data.admin = true;
  } catch (error) {
    asyncLog(
      "error",
      `Error verifying token (admin): ${JSON.stringify(error)}`
    );
    console.error(error);
  }

  return new Response(JSON.stringify({ data }));
}
