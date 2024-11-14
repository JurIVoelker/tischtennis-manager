import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { setTeamTokenCookie, teamCookieName } from "./lib/cookieUtils";
import { handleUnauthorizedUser } from "./lib/middlewareUtils";
import { getValidToken } from "./lib/APIUtils";
import { MIDDLEWARE_STATUS_UNAUTHORIZED } from "./constants/middlewareConstants";
import { LOGIN_PAGE_REGEX, TEAM_CLUB_PAGES_REGEX } from "./constants/regex";

export async function middleware(request: NextRequest) {
  // Skip ignored routes
  const ignoredRoutes = ["ungueltiger-link"];
  const urlPath = request.url.replace(/^https?:\/\/[^/]+/, "");

  /*
   * Skip ignored routes
   */

  if (ignoredRoutes.some((route) => urlPath.startsWith(`/${route}`))) {
    return NextResponse.next();
  }

  /*
   * Get slugs from url
   */

  const splitUrl = urlPath.split("/");
  const clubSlug = splitUrl[1];
  const teamSlug = splitUrl[2];

  /*
   * Get valid token serverside
   */

  const token = await getValidToken(request, clubSlug, teamSlug);

  if (token === null) {
    return NextResponse.redirect(
      new URL(
        `/ungueltiger-link?statusCode=${MIDDLEWARE_STATUS_UNAUTHORIZED}`,
        request.url
      )
    );
  }

  /*
   * Check if user has token in cookies.
   * If yes, validate it.
   * If not, redirect to login page
   */

  const loginPageUrl = new URL(`/${clubSlug}/${teamSlug}/login`, request.url);

  const userToken = request.cookies.get(
    teamCookieName(clubSlug, teamSlug)
  )?.value;

  if (token === userToken) {
    const response = NextResponse.next();
    setTeamTokenCookie(response, clubSlug, teamSlug, token);
    return response;
  } else if (!LOGIN_PAGE_REGEX.test(urlPath)) {
    const response = NextResponse.redirect(loginPageUrl);
    response.cookies.delete(teamCookieName(clubSlug, teamSlug));
    return response;
  }

  if (LOGIN_PAGE_REGEX.test(urlPath)) {
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
      const response = NextResponse.redirect(loginPageUrl);
      setTeamTokenCookie(response, clubSlug, teamSlug, authorizationStatus);
      return response;
    } else if (authorizationStatus instanceof NextResponse) {
      authorizationStatus.cookies.delete(teamCookieName(clubSlug, teamSlug));
      return authorizationStatus;
    }
  }

  return NextResponse.redirect(
    new URL(
      `/ungueltiger-link?statusCode=${MIDDLEWARE_STATUS_UNAUTHORIZED}`,
      request.url
    )
  );
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
