import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET() {
  return new Response(JSON.stringify({ data: await prisma.test.findMany() }));
}
