import { GetTeamAuthResponseInterface } from "@/app/api/protected/team-auth/route";
import axios from "axios";
import { log } from "console";
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
  } catch (error) {
    log(
      request,
      "error",
      `Getting the token serverside for ${clubSlug}/${teamSlug} failed`
    );
    console.error(error);
    return { token: null, allTokens: [] };
  }
  return tokenData;
};
