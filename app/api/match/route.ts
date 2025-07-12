import { UNKNOWN_ERROR } from "@/constants/APIError";
import {
  API_DELETE_MATCH_SCHEMA,
  API_POST_GAME_DATA_SCHEMA,
  API_PUT_GAME_DATA_SCHEMA,
} from "@/constants/zodSchemaConstants";
import { asyncLog } from "@/lib/logUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePaths } from "@/lib/revalidateUtils";
import { validateMatchId, validateRequest } from "@/lib/serversideAPIUtils";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["leader:own"],
    API_PUT_GAME_DATA_SCHEMA
  );

  if (response) return response;

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

  const res = await validateMatchId(clubSlug, teamSlug, matchId);
  if (!res.success)
    return new Response(JSON.stringify(res.error), { status: 400 });

  const matchDateTime = new Date(stringDate);

  const transactionResult = await prisma
    .$transaction(async (tx) => {
      matchDateTime.setHours(time.hour, time.minute, time.second);
      matchDateTime.setDate(matchDateTime.getDate());
      const location = await tx.location.findFirst({
        where: {
          matchId,
        },
      });
      if (!location) {
        await tx.location.create({
          data: {
            city,
            hallName,
            streetAddress,
            matchId,
          },
        });
      }
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
          matchDateTime: toUtcDate(matchDateTime),
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
      console.log(error);
      if (error.message) {
        asyncLog("error", `Error while putting match match: ${error?.message}`);
      }
      return new Response(UNKNOWN_ERROR, { status: 500 });
    });
  revalidatePaths([
    `/${clubSlug}/${teamSlug}`,
    `/${clubSlug}/${teamSlug}/spiel/anpassen/${matchId}`,
  ]);

  if (transactionResult instanceof Response) {
    return transactionResult;
  }

  return new Response("success", { status: 200 });
}

function isSummerTime(date: Date): boolean {
  const year = date.getFullYear();

  // Letzter Sonntag im März
  const start = new Date(year, 2, 31); // 31. März
  start.setDate(start.getDate() - start.getDay()); // Rückrechnen auf letzten Sonntag

  // Letzter Sonntag im Oktober
  const end = new Date(year, 9, 31); // 31. Oktober
  end.setDate(end.getDate() - end.getDay()); // Rückrechnen auf letzten Sonntag

  return date >= start && date < end;
}

const toUtcDate = (date: Date): string => {
  const isSummertime = isSummerTime(date);
  const hours = date.getHours() - (isSummertime ? 2 : 1);
  const newDate = new Date(date.setHours(hours));
  return newDate.toISOString();
};

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["leader:own"],
    API_POST_GAME_DATA_SCHEMA
  );

  if (response) return response;

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

  const matchDateTime = new Date(stringDate);

  const transactionResult = await prisma
    .$transaction(async (tx) => {
      matchDateTime.setHours(time.hour, time.minute, time.second);
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

      const res = await tx.match.create({
        data: {
          enemyClubName,
          teamId,
          matchDateTime: toUtcDate(matchDateTime),
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
      return res;
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

  revalidatePath(`/${clubSlug}/${teamSlug}`);
  return new Response(JSON.stringify({ data: transactionResult }), {
    status: 200,
  });
}

export async function DELETE(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["leader:own"],
    API_DELETE_MATCH_SCHEMA
  );

  if (response) return response;

  const {
    clubSlug,
    teamSlug,
    matchId,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  const res = await validateMatchId(clubSlug, teamSlug, matchId);
  if (!res.success)
    return new Response(JSON.stringify(res.error), { status: 400 });

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
