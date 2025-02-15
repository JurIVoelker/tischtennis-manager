import {
  API_DELETE_TEAM_SCHEMA,
  validateSchema,
} from "@/constants/zodSchemaConstants";
import { handleGetBody } from "@/lib/APIUtils";
import { asyncLog } from "@/lib/logUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const {
    success: isBodySuccess,
    body,
    responseReturnValue: invalidBodyResponse,
  } = await handleGetBody(request);
  if (!isBodySuccess) return invalidBodyResponse;

  const {
    success: isSchemaSuccess,
    responseReturnValue: invalidSchemaResponse,
  } = await validateSchema(API_DELETE_TEAM_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

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
