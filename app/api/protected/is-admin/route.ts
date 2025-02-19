import { handlePrismaError, prisma } from "@/lib/prisma/prisma";
import { hasServersidePermission } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const clubSlug = searchParams.get("clubSlug") || "";
  const email = searchParams.get("email");

  if (!clubSlug || !email) {
    return new Response(`clubSlug and email must be defined`, {
      status: 400,
    });
  }

  const success = await hasServersidePermission(["server"], request);
  if (!success) return new Response("Unauthorized", { status: 401 });

  let club;
  try {
    club = (
      await prisma.club.findMany({
        where: {
          slug: clubSlug,
        },
        include: {
          owners: true,
        },
      })
    )[0];
  } catch (error) {
    handlePrismaError(error);
  }

  if (!club)
    return new Response("not found", {
      status: 404,
    });

  return new Response(
    JSON.stringify({
      isAdmin: club.owners.some((owner) => owner.email === email),
    }),
    { status: 200 }
  );
}
