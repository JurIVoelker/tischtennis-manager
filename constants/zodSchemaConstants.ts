import { prisma } from "@/lib/prisma/prisma";
import { z } from "zod";
import {
  CLUB_NOT_FOUND_ERROR,
  MATCH_NOT_FOUND_ERROR,
  PLAYER_NOT_FOUND_ERROR,
  TEAM_NOT_FOUND_ERROR,
} from "./APIError";
import { matchAvailablilites } from "@/types/prismaTypes";

const validateTeamSlug = () =>
  z.string().refine(
    async (slug: string) => {
      return Boolean(await prisma.team.findUnique({ where: { slug: slug } }));
    },
    {
      message: TEAM_NOT_FOUND_ERROR,
    }
  );

const validateClubSlug = () =>
  z.string().refine(
    async (slug: string) => {
      return Boolean(await prisma.club.findUnique({ where: { slug: slug } }));
    },
    {
      message: CLUB_NOT_FOUND_ERROR,
    }
  );

const validatePlayerId = () =>
  z.string().refine(
    async (id: string) => {
      return Boolean(await prisma.player.findUnique({ where: { id } }));
    },
    {
      message: PLAYER_NOT_FOUND_ERROR,
    }
  );

const validatePlayerIds = () =>
  z
    .string()
    .array()
    .refine(
      async (ids: string[]) => {
        let isValid = true;
        for (const id of ids) {
          isValid =
            isValid &&
            Boolean(await prisma.player.findUnique({ where: { id } }));
        }
        return isValid;
      },
      {
        message: PLAYER_NOT_FOUND_ERROR,
      }
    );

const validateMatchId = () =>
  z.string().refine(
    async (id: string) => {
      return Boolean(await prisma.match.findUnique({ where: { id } }));
    },
    {
      message: MATCH_NOT_FOUND_ERROR,
    }
  );

export const validateSchema = async (
  schema: z.ZodSchema,
  value: object
): Promise<{ success: boolean; responseReturnValue?: Response }> => {
  const result = await schema.safeParseAsync(value);

  if (!result.success) {
    return {
      success: false,
      responseReturnValue: new Response(
        JSON.stringify(result.error?.issues || { error: "unknown" }),
        {
          status: 400,
        }
      ),
    };
  }
  return { success: true };
};

export const API_VOTE_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  teamSlug: validateTeamSlug(),
  playerId: validatePlayerId(),
  matchId: validateMatchId(),
  vote: z.enum([...matchAvailablilites] as [string, ...string[]]),
});

export const API_PUT_GAME_DATA_SCHEMA = z.object({
  city: z.string(),
  date: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)) && val === new Date(val).toISOString(),
      {
        message: "Invalid date format. Must be an ISO 8601 string.",
      }
    ),
  hallName: z.string(),
  isHomeGame: z.boolean(),
  streetAddress: z.string(),
  time: z.object({
    hour: z.number(),
    minute: z.number(),
    second: z.number(),
  }),
  clubSlug: validateClubSlug(),
  teamSlug: validateTeamSlug(),
  matchId: validateMatchId(),
});

export const API_POST_GAME_DATA_SCHEMA = z.object({
  city: z.string(),
  date: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)) && val === new Date(val).toISOString(),
      {
        message: "Invalid date format. Must be an ISO 8601 string.",
      }
    ),
  hallName: z.string(),
  isHomeGame: z.boolean(),
  streetAddress: z.string(),
  time: z.object({
    hour: z.number(),
    minute: z.number(),
    second: z.number(),
  }),
  clubSlug: validateClubSlug(),
  teamSlug: validateTeamSlug(),
  enemyClubName: z.string(),
});

export const API_PUT_PLAYER_POSITIONS_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  teamSlug: validateTeamSlug(),
  playerIds: validatePlayerIds(),
});

export const API_DELETE_PLAYER_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  teamSlug: validateTeamSlug(),
  playerId: validatePlayerId(),
});

export const API_DELETE_MATCH_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  teamSlug: validateTeamSlug(),
  matchId: validateMatchId(),
});

export const API_POST_PLAYER_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  teamSlug: validateTeamSlug(),
  firstName: z.string(),
  lastName: z.string(),
});

export const API_PUT_LINEUP_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  teamSlug: validateTeamSlug(),
  playerIds: validatePlayerIds(),
  matchId: validateMatchId(),
});
