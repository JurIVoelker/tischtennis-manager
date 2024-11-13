import { handlePrismaError, prisma } from "@/lib/prisma/prisma";
export const dynamic = "force-dynamic"; // defaults to auto
export async function GET() {
  let response;
  try {
    response = await prisma.club.findMany();
  } catch (error) {
    return handlePrismaError(error);
  }
  return new Response(JSON.stringify({ data: response }));
}

export async function POST() {
  // TODO IMPLEMENT
  return new Response("Method not implemented", { status: 501 });
}
