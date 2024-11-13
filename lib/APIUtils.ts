import axios from "axios";
import { NextRequest } from "next/server";

export const getValidToken = async (
  request: NextRequest,
  clubSlug: string,
  teamSlug: string
): Promise<string | null> => {
  let token;
  const basePath = request.nextUrl.href.split("/").slice(0, 3).join("/");
  try {
    const res = await axios.get(
      `${basePath}/api/protected/team-auth?clubSlug=${clubSlug}&teamSlug=${teamSlug}`
    );
    token = res.data.token;
  } catch (error) {
    return null;
  }
  return token;
};
