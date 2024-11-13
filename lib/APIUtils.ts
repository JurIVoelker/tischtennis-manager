import { MIDDLEWARE_STATUS_UNAUTHORIZED } from "@/constants/middlewareConstants";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const getValidToken = async (
  request: NextRequest,
  clubSlug: string,
  teamSlug: string
): Promise<NextResponse | string> => {
  let token;
  const basePath = request.nextUrl.href.split("/").slice(0, 3).join("/");
  try {
    const res = await axios.get(
      `${basePath}/api/protected/team-auth?clubSlug=${clubSlug}&teamSlug=${teamSlug}`
    );
    token = res.data.token;
  } catch (error) {
    return NextResponse.redirect(
      new URL(
        `/ungueltiger-link?statusCode=${MIDDLEWARE_STATUS_UNAUTHORIZED}`,
        request.url
      )
    );
  }
  return token;
};
