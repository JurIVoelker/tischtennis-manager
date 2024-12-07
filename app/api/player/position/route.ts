import { INVALID_TOKEN_ERROR, UNKNOWN_ERROR } from "@/constants/APIError";
import {
  API_PUT_PLAYER_POSITIONS_SCHEMA,
  validateSchema,
} from "@/constants/zodSchemaConstants";
import { getLeaderData, handleGetBody } from "@/lib/APIUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const {
    success: isBodySuccess,
    body,
    responseReturnValue: invalidBodyResponse,
  } = await handleGetBody(request);
  if (!isBodySuccess) return invalidBodyResponse;

  const {
    success: isSchemaSuccess,
    responseReturnValue: invalidSchemaResponse,
  } = await validateSchema(API_PUT_PLAYER_POSITIONS_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    clubSlug,
    teamSlug,
    playerIds,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  const loggedinUserData = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { email } = loggedinUserData || {};
  let isTeamLeader = false;
  if (email) {
    isTeamLeader = (await getLeaderData(clubSlug, teamSlug, email))
      .isTeamLeader;
  }

  if (!isTeamLeader) {
    return new Response(INVALID_TOKEN_ERROR, { status: 401 });
  }

  await prisma
    .$transaction(async (tx) => {
      const team = await tx.team.findUnique({
        where: {
          slug: teamSlug,
          club: {
            slug: clubSlug,
          },
        },
        include: {
          teamPosition: true,
          players: true,
        },
      });

      if (!team?.id) throw new Error("Team not found");
      if (
        playerIds.some(
          (playerId: string) => !team.players.some((p) => p.id === playerId)
        )
      ) {
        throw new Error("Some player is not part of team");
      }

      const missingPlayers = team.players.filter(
        (p) => !playerIds.includes(p.id)
      );

      const teamPosition = team.teamPosition;
      for (const { id } of teamPosition) {
        await tx.playerTeamPosition.delete({
          where: {
            id,
          },
        });
      }

      for (let i = 0; i < playerIds.length; i++) {
        await tx.playerTeamPosition.create({
          data: {
            position: i,
            playerId: playerIds[i],
            teamId: team.id,
          },
        });
      }

      for (let i = 0; i < missingPlayers.length; i++) {
        await tx.playerTeamPosition.create({
          data: {
            position: playerIds.length + i,
            playerId: missingPlayers[i].id,
            teamId: team.id,
          },
        });
      }
    })
    .catch(() => {
      return new Response(UNKNOWN_ERROR, { status: 500 });
    });
  const allMatches = await prisma.match.findMany({
    where: {
      team: {
        slug: teamSlug,
        club: {
          slug: clubSlug,
        },
      },
    },
  });

  const lineupPaths = allMatches.map(
    (match) =>
      `/${clubSlug}/${teamSlug}/spiel/aufstellung/verwalten/${match.id}`
  );

  const allTeamSlugs = await prisma.team.findMany({
    where: {
      club: {
        slug: clubSlug,
      },
    },
    select: {
      slug: true,
    },
  });

  const addPlayerTeamPaths = allTeamSlugs.map(
    (team) => `/${clubSlug}/${team.slug}/spieler/hinzufuegen`
  );

  revalidatePaths([
    `/${clubSlug}/${teamSlug}`,
    `/${clubSlug}/${teamSlug}/spieler/sortieren`,
    `/${clubSlug}/${teamSlug}/spieler/verwalten`,
    ...addPlayerTeamPaths,
    ...lineupPaths,
  ]);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
