import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";
import { API_PUT_POST_MATCH_SYNC_SCHEMA as API_PUT_POST_MATCH_SYNC_SCHEMA } from "@/constants/zodSchemaConstants";
import { z } from "zod";
import { upsertMatchesByIds } from "@/scripts/mytt/importGames";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import slugify from "slugify";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["admin", "server"],
    API_PUT_POST_MATCH_SYNC_SCHEMA
  );

  if (response) return response;

  const { ids, clubSlug } = body as z.infer<
    typeof API_PUT_POST_MATCH_SYNC_SCHEMA
  >;

  const matches = await upsertMatchesByIds(ids);

  const teamSlugs = Array.from(
    new Set(
      matches.map((match) =>
        slugify(
          match.isHomeGame ? match.teams.home.name : match.teams.away.name
        )
      )
    )
  );

  revalidatePaths([...teamSlugs.map((slug) => `/${clubSlug}/${slug}`)]);

  await prisma.hiddenMatch.deleteMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
