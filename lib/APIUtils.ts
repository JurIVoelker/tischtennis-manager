import { GetTeamAuthResponseInterface } from "@/app/api/protected/team-auth/route";
import axios from "axios";
import { NextRequest } from "next/server";
import { asyncLog } from "./logUtils";

export const getValidToken = async (
  request: NextRequest,
  clubSlug: string,
  teamSlug: string
): Promise<GetTeamAuthResponseInterface> => {
  let tokenData;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await axios.get(
      `${baseUrl}/api/protected/team-auth?clubSlug=${clubSlug}&teamSlug=${teamSlug}`
    );
    tokenData = res.data;
  } catch (error) {
    asyncLog(
      "error",
      `Getting the token serverside for ${clubSlug}/${teamSlug} failed`
    );
    console.error(error);
    return { token: null, allTokens: [] };
  }
  return tokenData;
};
