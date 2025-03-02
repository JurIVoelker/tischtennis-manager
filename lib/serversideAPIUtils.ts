import { NextRequest } from "next/server";
import { z, ZodObject } from "zod";
import {
  getValidToken,
  handleGetBody,
  hasAdminPermission,
  hasLeaderPermission,
} from "./APIUtils";
import { validateSchema } from "@/constants/zodSchemaConstants";
import { asyncLog } from "./logUtils";
import { getAuthCookies } from "./cookieUtils";
import { prisma } from "./prisma/prisma";

type Permission =
  | "server"
  | "leader:own"
  | "leader:all"
  | "user:own"
  | "user:all"
  | "admin";

export const hasServersidePermission = async (
  permissions: Permission[],
  request: NextRequest,
  clubSlug?: string,
  teamSlug?: string
) => {
  const slugsValid = (permission: Permission) => {
    const slugsRequired: Permission[] = ["leader:own", "user:own"];
    if (slugsRequired.includes(permission) && (!clubSlug || !teamSlug)) {
      console.error("clubSlug or teamSlug not provided");
      return false;
    }
    return true;
  };

  for (const permission of permissions) {
    if (permission === "leader:own" && slugsValid(permission)) {
      const { success } = await hasLeaderPermission(
        clubSlug as string,
        teamSlug as string,
        request
      );
      if (success) return true;
    }

    if (permission === "server") {
      const token = request.cookies.get("server-token");
      const envToken = process?.env?.SERVER_API_TOKEN;
      if (!envToken) asyncLog("error", "SERVER_API_TOKEN not set");
      else if (token?.value === process?.env?.SERVER_API_TOKEN) return true;
    }

    if (permission === "user:own" && slugsValid(permission)) {
      const { allTokens: allServerTokens } =
        (await getValidToken(clubSlug as string, teamSlug as string)) || {};
      const { token: userToken } = getAuthCookies(
        request,
        clubSlug as string,
        teamSlug as string
      );
      if (allServerTokens?.includes(userToken || "")) return true;
    }

    if (permission === "admin" && slugsValid(permission)) {
      const { success } = await hasAdminPermission(clubSlug as string, request);
      if (success) return true;
    }
  }
  return false;
};

export const validateRequest = async (
  request: NextRequest,
  permissions: Permission[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodObject<any>
) => {
  const {
    success: isBodySuccess,
    body,
    responseReturnValue,
  } = await handleGetBody(request);

  if (!isBodySuccess) {
    return { body: {}, response: responseReturnValue };
  }

  const { clubSlug, teamSlug } =
    (body as { clubSlug: string; teamSlug: string }) || {};

  const permissionsSuccess = await hasServersidePermission(
    permissions,
    request,
    clubSlug,
    teamSlug
  );
  if (!permissionsSuccess)
    return {
      body: {},
      response: new Response("Unauthorized", { status: 401 }),
    };

  const {
    success: isSchemaSuccess,
    responseReturnValue: invalidSchemaResponse,
  } = await validateSchema(schema, body || {});

  if (!isSchemaSuccess) {
    return { body: {}, response: invalidSchemaResponse };
  }

  return { body, response: null };
};

export const validateMatchId = async (
  clubSlug: string,
  teamSlug: string,
  matchId: string
) => {
  const matchIdSchema = z.string().refine(async (id) => {
    const match = await prisma.match.findUnique({
      where: {
        id,
        AND: {
          team: {
            slug: teamSlug,
          },
          AND: {
            team: {
              club: {
                slug: clubSlug,
              },
            },
          },
        },
      },
    });
    return Boolean(match?.id);
  }, "Match not found");
  return await matchIdSchema.safeParseAsync(matchId);
};

export const validatePlayerId = async (
  clubSlug: string,
  teamSlug: string,
  playerId: string
) => {
  const playerIdSchema = z.string().refine(async (id) => {
    const player = await prisma.player.findUnique({
      where: {
        id,
        AND: {
          team: {
            slug: teamSlug,
          },
          AND: {
            team: {
              club: {
                slug: clubSlug,
              },
            },
          },
        },
      },
    });
    return Boolean(player?.id);
  }, "Player not found");
  return await playerIdSchema.safeParseAsync(playerId);
};
