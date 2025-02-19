import { handlePrismaError, prisma } from "@/lib/prisma/prisma";
import { hasServersidePermission } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const clubSlug = searchParams.get("clubSlug") || "";
  const teamSlug = searchParams.get("teamSlug") || "";

  const success = await hasServersidePermission(
    ["leader:own"],
    request,
    clubSlug,
    teamSlug
  );

  if (!success) return new Response("Unauthorized", { status: 401 });

  if (!clubSlug || !teamSlug) {
    return new Response(`clubSlug and teamSlug must be defined`, {
      status: 400,
    });
  }

  let club;
  try {
    club = await prisma.club.findUnique({
      where: {
        slug: clubSlug,
      },
      include: {
        teams: {
          where: {
            slug: teamSlug,
          },
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

  const teamAuthToken = club.teams[0]?.teamAuth?.token;

  if (!teamAuthToken)
    return new Response("team has no token", {
      status: 404,
    });

  return new Response(JSON.stringify({ token: teamAuthToken }));
}
