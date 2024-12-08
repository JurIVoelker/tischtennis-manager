import { INVALID_TOKEN_ERROR, UNKNOWN_ERROR } from "@/constants/APIError";
import {
  API_DELETE_MATCH_SCHEMA,
  API_POST_GAME_DATA_SCHEMA,
  API_PUT_GAME_DATA_SCHEMA,
  validateSchema,
} from "@/constants/zodSchemaConstants";
import { getLeaderData, handleGetBody } from "@/lib/APIUtils";
import { asyncLog } from "@/lib/logUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const {
    success: isBodySuccess,
    body,
    responseReturnValue: invalidBodyResponse,
  } = await handleGetBody(request);
  if (!isBodySuccess) return invalidBodyResponse;

  const {
    success: isSchemaSuccess,
    responseReturnValue: invalidSchemaResponse,
  } = await validateSchema(API_PUT_GAME_DATA_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    city,
    date: stringDate,
    hallName,
    isHomeGame,
    streetAddress,
    time,
    clubSlug,
    teamSlug,
    matchId,
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

  const matchDateTime = new Date(stringDate);

  const transactionResult = await prisma
    .$transaction(async (tx) => {
      matchDateTime.setHours(time.hour - 1, time.minute, time.second);
      matchDateTime.setDate(matchDateTime.getDate() + 1);
      await tx.match.update({
        where: {
          id: matchId,
          AND: {
            team: {
              slug: teamSlug,
              club: {
                slug: clubSlug,
              },
            },
          },
        },
        data: {
          matchDateTime,
          isHomeGame,
          location: {
            update: {
              city,
              hallName,
              streetAddress,
            },
          },
        },
      });
    })
    .catch((error) => {
      if (error.message) {
        asyncLog("error", `Error while putting match match: ${error?.message}`);
      }
      return new Response(UNKNOWN_ERROR, { status: 500 });
    });
  if (transactionResult instanceof Response) {
    return transactionResult;
  }
  revalidatePaths([
    `/${clubSlug}/${teamSlug}`,
    `/${clubSlug}/${teamSlug}/spiel/anpassen/${matchId}`,
  ]);
  return new Response("success", { status: 200 });
}

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
  } = await validateSchema(API_POST_GAME_DATA_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    city,
    date: stringDate,
    hallName,
    isHomeGame,
    streetAddress,
    time,
    clubSlug,
    teamSlug,
    enemyClubName,
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

  const matchDateTime = new Date(stringDate);

  const transactionResult = await prisma
    .$transaction(async (tx) => {
      matchDateTime.setHours(time.hour - 1, time.minute, time.second);
      matchDateTime.setDate(matchDateTime.getDate() + 1);
      const teamId = (
        await tx.team.findUnique({
          where: {
            slug: teamSlug,
            club: {
              slug: clubSlug,
            },
          },
        })
      )?.id;

      if (!teamId) throw new Error("Team not found");

      await tx.match.create({
        data: {
          enemyClubName,
          teamId,
          matchDateTime,
          isHomeGame,
          location: {
            create: {
              city,
              hallName,
              streetAddress,
            },
          },
        },
      });
    })
    .catch((error) => {
      if (error.message) {
        asyncLog("error", `Error while creating match: ${error?.message}`);
      }
      return new Response(UNKNOWN_ERROR, { status: 500 });
    });
  if (transactionResult instanceof Response) {
    return transactionResult;
  }

  revalidatePaths([`/${clubSlug}/${teamSlug}`]);
  return new Response("success", { status: 200 });
}

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
  } = await validateSchema(API_DELETE_MATCH_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    clubSlug,
    teamSlug,
    matchId,
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

  const transactionResult = await prisma
    .$transaction(async (tx) => {
      const match = await tx.match.findUnique({
        where: {
          id: matchId,
          AND: {
            team: {
              slug: teamSlug,
              club: {
                slug: clubSlug,
              },
            },
          },
        },
      });

      if (!match?.id) throw new Error("Match not found");

      await tx.location.deleteMany({
        where: {
          matchId: matchId,
        },
      });

      await tx.lineup.deleteMany({
        where: {
          matchId: matchId,
        },
      });

      await tx.matchAvailabilityVote.deleteMany({
        where: {
          matchId: matchId,
        },
      });

      await tx.match.delete({
        where: {
          id: matchId,
        },
      });
    })
    .catch((error) => {
      if (error.message) {
        asyncLog("error", `Error while deleting match: ${error?.message}`);
        return new Response(error.message, { status: 400 });
      }
      return new Response(UNKNOWN_ERROR, { status: 500 });
    });
  if (transactionResult instanceof Response) {
    return transactionResult;
  }

  revalidatePaths([`/${clubSlug}/${teamSlug}`]);
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
