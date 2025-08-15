import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";
import { API_PUT_POST_MATCH_SYNC_SCHEMA as API_PUT_POST_MATCH_SYNC_SCHEMA } from "@/constants/zodSchemaConstants";
import { z } from "zod";
import { upsertMatchesByIds } from "@/scripts/mytt/importGames";
import { prisma } from "@/lib/prisma/prisma";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["admin"],
    API_PUT_POST_MATCH_SYNC_SCHEMA
  );

  if (response) return response;

  const { ids } = body as z.infer<typeof API_PUT_POST_MATCH_SYNC_SCHEMA>;

  await upsertMatchesByIds(ids);
  await prisma.hiddenMatch.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
