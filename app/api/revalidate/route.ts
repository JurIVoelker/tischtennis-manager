import { ERRORS } from "@/constants/prismaErrors";
import { asyncLog } from "@/lib/logUtils";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const path = searchParams.get("path");
  if (!path) return new Response(ERRORS.INVALID_VALUE, { status: 400 });

  asyncLog("info", `Revalidating path: ${path}`);
  revalidatePath(path);
  return new Response("Revalidation started", { status: 200 });
}
