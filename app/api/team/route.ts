import { TEAM_SLUG_ALREADY_EXISTS_ERROR } from "@/constants/APIError";
import {
  API_DELETE_TEAM_SCHEMA,
  API_POST_TEAM_SCHEMA,
} from "@/constants/zodSchemaConstants";
import { asyncLog } from "@/lib/logUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { validateRequest } from "@/lib/serversideAPIUtils";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";
import slugify from "slugify";

export async function DELETE(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["admin"],
    API_DELETE_TEAM_SCHEMA
  );

  if (response) return response;

  const {
    teamId,
    clubSlug,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: { matches: true },
  });
  const teamSlug = team?.slug;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.playerTeamPosition.deleteMany({ where: { teamId } });
      await tx.matchAvailabilityVote.deleteMany({
        where: {
          match: {
            teamId,
          },
        },
      });
      await tx.lineup.deleteMany({
        where: {
          match: {
            teamId,
          },
        },
      });
      await tx.location.deleteMany({
        where: {
          match: {
            teamId,
          },
        },
      });
      await tx.teamAuth.deleteMany({ where: { teamId } });
      await tx.teamLeader.deleteMany({ where: { teamId } });
      await tx.teamLeaderInvite.deleteMany({
        where: { teamId },
      });
      await tx.player.deleteMany({ where: { teamId } });
      await tx.match.deleteMany({ where: { teamId } });
      await tx.team.delete({ where: { id: teamId } });
    });
  } catch (error) {
    asyncLog("error", JSON.stringify(error));
  }

  revalidatePaths([
    `/${clubSlug}/${teamSlug}/login`,
    `/${clubSlug}/${teamSlug}/mannschaftsfuehrer/login/fehlgeschlagen`,
    `/${clubSlug}/${teamSlug}/mannschaftsfuehrer/login/validieren`,
    ...(team?.matches || []).map(
      (match) => `/${clubSlug}/${teamSlug}/spiel/anpassen/${match.id}`
    ),
    ...(team?.matches || []).map(
      (match) =>
        `/${clubSlug}/${teamSlug}/spiel/aufstellung/verwalten/${match.id}`
    ),
    `/${clubSlug}/${teamSlug}/spiel/neu`,
    `/${clubSlug}/${teamSlug}/spieler/hinzufuegen`,
    `/${clubSlug}/${teamSlug}/spieler/sortieren`,
    `/${clubSlug}/${teamSlug}/spieler/verwalten`,
    `/${clubSlug}/${teamSlug}/spieler`,
    `/${clubSlug}/${teamSlug}/admin/mannschaftsfuehrer`,
  ]);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["admin"],
    API_POST_TEAM_SCHEMA
  );

  if (response) return response;

  const {
    clubSlug,
    teamName,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  const teamSlug = slugify(teamName, { lower: true });

  const club = await prisma.club.findMany({
    where: {
      slug: clubSlug,
    },
    include: {
      teams: {
        where: {
          slug: teamSlug,
        },
      },
    },
  });

  if (club[0].teams.length > 0) {
    return new Response(
      JSON.stringify({ error: [TEAM_SLUG_ALREADY_EXISTS_ERROR], ok: false }),
      { status: 400 }
    );
  }

  await prisma.team.create({
    data: {
      club: { connect: { slug: clubSlug } },
      name: teamName,
      slug: teamSlug,
    },
  });

  revalidatePath(`/${clubSlug}/${teamSlug}/admin/mannschaftsfuehrer`);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
