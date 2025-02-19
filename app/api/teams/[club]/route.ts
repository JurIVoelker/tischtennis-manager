import { ERRORS } from "@/constants/prismaErrors";
import { handlePrismaError, prisma } from "@/lib/prisma/prisma";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(
  _: Request,
  { params }: { params: Promise<{ club: string }> }
) {
  const clubSlug = (await params).club;
  if (!clubSlug) return new Response(ERRORS.INVALID_VALUE, { status: 400 });
  let response;
  try {
    response = await prisma.club.findUnique({
      where: {
        slug: clubSlug,
      },
      include: {
        teams: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });
  } catch (error) {
    return handlePrismaError(error);
  }
  if (response === null) return new Response(ERRORS.NOT_FOUND, { status: 404 });
  return new Response(JSON.stringify({ data: response?.teams || [] }));
}
