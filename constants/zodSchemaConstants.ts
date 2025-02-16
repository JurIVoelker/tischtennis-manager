import { prisma } from "@/lib/prisma/prisma";
import { z } from "zod";
import {
  CLUB_NOT_FOUND_ERROR,
  LEADER_NOT_FOUND_ERROR,
  MATCH_NOT_FOUND_ERROR,
  PLAYER_NOT_FOUND_ERROR,
  TEAM_LEADER_INVITE_NOT_FOUND_ERROR,
  TEAM_NOT_FOUND_ERROR,
} from "./APIError";
import { matchAvailablilites } from "@/types/prismaTypes";

export const timeLimitMap: { [key: string]: number } = {
  "2weeks": 2 * 7 * 24 * 60 * 60 * 1000,
  "1month": 30 * 24 * 60 * 60 * 1000,
  "2months": 60 * 24 * 60 * 60 * 1000,
  infinite: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
};

const validateTeamSlug = () =>
  z.string().refine(
    async (slug: string) => {
      return Boolean(await prisma.team.findUnique({ where: { slug: slug } }));
    },
    {
      message: TEAM_NOT_FOUND_ERROR,
    }
  );

const validateTeamLeaderInvite = () =>
  z.string().refine(
    async (id: string) => {
      return Boolean(
        await prisma.teamLeaderInvite.findUnique({ where: { id } })
      );
    },
    {
      message: TEAM_LEADER_INVITE_NOT_FOUND_ERROR,
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

const validateLeaderId = () =>
  z.string().refine(
    async (id: string) => {
      return Boolean(await prisma.teamLeader.findUnique({ where: { id } }));
    },
    {
      message: LEADER_NOT_FOUND_ERROR,
    }
  );

const validateTeamId = () =>
  z.string().refine(
    async (id: string) => {
      return Boolean(await prisma.team.findUnique({ where: { id } }));
    },
    {
      message: TEAM_NOT_FOUND_ERROR,
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

export const API_PUT_LEADER_EMAIL_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  leaderId: validateLeaderId(),
  email: z.string().email().nullable(),
  name: z.string().nullable(),
});

export const API_DELETE_LEADER_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  leaderId: validateLeaderId(),
});

export const API_DELETE_TEAM_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  teamId: validateTeamId(),
});

export const API_POST_TEAM_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  teamName: z.string(),
});

export const API_POST_LEADER_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  teamId: z.string(),
  email: z.string().email(),
  fullName: z.string(),
});

export const API_POST_LEADER_INVITE_TOKEN_SCHEMA = z.object({
  clubSlug: validateClubSlug(),
  teamSlug: validateTeamSlug(),
  name: z.string(),
  email: z.string().email(),
  timeLimit: z.enum(Object.keys(timeLimitMap) as [string, ...string[]]),
});

export const API_DELETE_LEADER_INVITE_TOKEN_SCHEMA = z.object({
  id: validateTeamLeaderInvite(),
  clubSlug: validateClubSlug(),
});

export const API_PUT_LEADER_INVITE_TOKEN_SCHEMA = z.object({
  id: validateTeamLeaderInvite(),
  expiresAt: z.string(),
  clubSlug: validateClubSlug(),
});
