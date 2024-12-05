import { prisma } from "@/lib/prisma/prisma";
import { z } from "zod";
import {
  CLUB_NOT_FOUND_ERROR,
  MATCH_NOT_FOUND_ERROR,
  PLAYER_NOT_FOUND_ERROR,
  TEAM_NOT_FOUND_ERROR,
} from "./APIError";
import { matchAvailablilites } from "@/types/prismaTypes";

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
  clubSlug: z.string().refine(
    async (slug: string) => {
      return Boolean(await prisma.club.findUnique({ where: { slug: slug } }));
    },
    {
      message: CLUB_NOT_FOUND_ERROR,
    }
  ),
  teamSlug: z.string().refine(
    async (slug: string) => {
      return Boolean(await prisma.team.findUnique({ where: { slug: slug } }));
    },
    {
      message: TEAM_NOT_FOUND_ERROR,
    }
  ),
  playerId: z.string().refine(
    async (id: string) => {
      return Boolean(await prisma.player.findUnique({ where: { id } }));
    },
    {
      message: PLAYER_NOT_FOUND_ERROR,
    }
  ),
  matchId: z.string().refine(
    async (id: string) => {
      return Boolean(await prisma.match.findUnique({ where: { id } }));
    },
    {
      message: MATCH_NOT_FOUND_ERROR,
    }
  ),
  vote: z.enum([...matchAvailablilites] as [string, ...string[]]),
});
