import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { setTeamTokenCookie, teamCookieName } from "./lib/cookieUtils";
import { handleUnauthorizedUser } from "./lib/middlewareUtils";
import { getValidToken } from "./lib/APIUtils";
import { MIDDLEWARE_STATUS_UNAUTHORIZED } from "./constants/middlewareConstants";

export async function middleware(request: NextRequest) {
  const clubSlug = "Test-Club";
  const teamSlug = "Herren-I";

  // Get user token from cookie
  const userToken = request.cookies.get(
    teamCookieName(clubSlug, teamSlug)
  )?.value;

  /*
   * Check if user token is valid
   */
  if (userToken) {
    const token = await getValidToken(request, clubSlug, teamSlug);
    if (token === null) {
      return NextResponse.redirect(
        new URL(
          `/ungueltiger-link?statusCode=${MIDDLEWARE_STATUS_UNAUTHORIZED}`,
          request.url
        )
      );
    }
    if (token === userToken) {
      const response = NextResponse.next();
      setTeamTokenCookie(response, clubSlug, teamSlug, token);
      return response;
    }
  }

  /*
   * Handle unauthorized users
   */
  const authorizationStatus = await handleUnauthorizedUser(
    request,
    clubSlug,
    teamSlug
  );

  if (typeof authorizationStatus === "string") {
    // If the user could be authorized, by checking the invite token, redirect to the login page
    const url = new URL(`/${clubSlug}/${teamSlug}/login`, request.url);
    const response = NextResponse.redirect(url);
    setTeamTokenCookie(response, clubSlug, teamSlug, authorizationStatus);
    return response;
  } else if (authorizationStatus instanceof NextResponse) {
    authorizationStatus.cookies.delete(teamCookieName(clubSlug, teamSlug));
    return authorizationStatus;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|ungueltiger-link).*)",
  ],
};
