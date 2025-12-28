import { API_POST_SYNC_SETTINGS_SCHEMA } from "@/constants/zodSchemaConstants";
import { prisma } from "@/lib/prisma/prisma";
import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["admin"],
    API_POST_SYNC_SETTINGS_SCHEMA
  );

  if (response) return response;

  const {
    autoSync, includeRRSync }
    = body as z.infer<typeof API_POST_SYNC_SETTINGS_SCHEMA>;

  const existingSettings = await prisma.settings.findFirst();

  await prisma.settings.upsert({
    where: { id: existingSettings?.id || "" },
    create: {
      autoSync,
      includeRRSync,
    },
    update: {
      autoSync,
      includeRRSync,
    },
  })

  return new Response(JSON.stringify({}), { status: 200 });
}