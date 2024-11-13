import { MIDDLEWARE_STATUS_UNAUTHORIZED } from "@/constants/middlewareConstants";
import { NextRequest, NextResponse } from "next/server";
import { getValidToken } from "./APIUtils";

export const handleUnauthorizedUser = async (
  request: NextRequest,
  clubSlug: string,
  teamSlug: string
): Promise<NextResponse | string> => {
  const { searchParams } = request.nextUrl;

  const inviteToken = searchParams.get("inviteToken");
  if (!inviteToken)
    return NextResponse.redirect(
      new URL(
        `/ungueltiger-link?statusCode=${MIDDLEWARE_STATUS_UNAUTHORIZED}`,
        request.url
      )
    );

  const token = await getValidToken(request, clubSlug, teamSlug);
  if (typeof token !== "string" && token instanceof Promise) {
    return token;
  }

  if (token !== inviteToken) {
    return NextResponse.redirect(
      new URL(
        `/ungueltiger-link?statusCode=${MIDDLEWARE_STATUS_UNAUTHORIZED}`,
        request.url
      )
    );
  }

  return token;
};
