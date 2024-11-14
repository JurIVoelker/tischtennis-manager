import { GetTeamAuthResponseInterface } from "@/app/api/protected/team-auth/route";
import axios from "axios";
import { NextRequest } from "next/server";

export const getValidToken = async (
  request: NextRequest,
  clubSlug: string,
  teamSlug: string
): Promise<GetTeamAuthResponseInterface> => {
  let tokenData;
  const basePath = request.nextUrl.href.split("/").slice(0, 3).join("/");
  try {
    const res = await axios.get(
      `${basePath}/api/protected/team-auth?clubSlug=${clubSlug}&teamSlug=${teamSlug}`
    );
    tokenData = res.data;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return { token: null, allTokens: [] };
  }
  return tokenData;
};
