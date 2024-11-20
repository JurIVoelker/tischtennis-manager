import { GetTeamAuthResponseInterface } from "@/app/api/protected/team-auth/route";
import axios from "axios";
import { asyncLog } from "./logUtils";

export const getValidToken = async (
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      asyncLog(
        "error",
        `There was an unexpected error for fetching the token serverside for ${clubSlug}/${teamSlug}`
      );
      console.error(error);
    }
    return { token: null, allTokens: [] };
  }
  return tokenData;
};
