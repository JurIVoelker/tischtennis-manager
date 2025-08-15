import { API_PUT_POST_MATCH_SYNC_SCHEMA as API_PUT_POST_MATCH_SYNC_SCHEMA } from "@/constants/zodSchemaConstants";
import { prisma } from "@/lib/prisma/prisma";
import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["admin"],
    API_PUT_POST_MATCH_SYNC_SCHEMA
  );

  if (response) return response;

  const { ids } = body as z.infer<typeof API_PUT_POST_MATCH_SYNC_SCHEMA>;

  for (const id of ids) {
    await prisma.hiddenMatch.upsert({
      where: { id },
      create: { id },
      update: {},
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["admin"],
    API_PUT_POST_MATCH_SYNC_SCHEMA
  );

  if (response) return response;

  const { ids } = body as z.infer<typeof API_PUT_POST_MATCH_SYNC_SCHEMA>;

  await prisma.hiddenMatch.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
