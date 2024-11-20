import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
  setTeamTokenCookie,
  getAuthCookieName,
  getAuthCookies as getUserAuthCookie,
} from "./lib/cookieUtils";
import { handleUnauthorizedUser } from "./lib/middlewareUtils";
import { getValidToken } from "./lib/APIUtils";
import { MIDDLEWARE_STATUS_UNAUTHORIZED } from "./constants/middlewareConstants";
import { LOGIN_PAGE_REGEX } from "./constants/regex";
import { asyncLog } from "./lib/logUtils";

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

  asyncLog(
    "info",
    `request.url = ${
      request.url
    }, urlPath = ${urlPath}, splitUrl = ${JSON.stringify(
      splitUrl
    )}, clubSlug = ${clubSlug}, teamSlug = ${teamSlug}`
  );

  /*
   * Get valid token serverside
   */

  const { token, allTokens } = await getValidToken(clubSlug, teamSlug);

  if (token === null) {
    asyncLog("error", "Server could not get valid token");
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

  const { token: pageUserToken, allTokens: allUserTokens } = getUserAuthCookie(
    request,
    clubSlug,
    teamSlug
  );

  if (
    !LOGIN_PAGE_REGEX.test(urlPath) &&
    Array.isArray(allUserTokens) &&
    allUserTokens.some((userToken) => allTokens.includes(userToken))
  ) {
    return NextResponse.next();
  } else if (LOGIN_PAGE_REGEX.test(urlPath) && token === pageUserToken) {
    asyncLog("info", "Setting team token cookie");
    const response = NextResponse.next();
    setTeamTokenCookie(request, response, clubSlug, teamSlug, token);
    return response;
  } else if (!LOGIN_PAGE_REGEX.test(urlPath) && pageUserToken) {
    asyncLog("error", "User uses invalid token");
    const response = NextResponse.redirect(
      new URL(
        `/ungueltiger-link?statusCode=${MIDDLEWARE_STATUS_UNAUTHORIZED}`,
        request.url
      )
    );
    response.cookies.delete(getAuthCookieName(clubSlug));
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
      asyncLog("info", "user could be authorized");
      // If the user could be authorized, by checking the invite token, redirect to the login page
      const response = NextResponse.redirect(loginPageUrl);
      setTeamTokenCookie(
        request,
        response,
        clubSlug,
        teamSlug,
        authorizationStatus
      );
      return response;
    } else if (authorizationStatus instanceof NextResponse) {
      asyncLog("error", "User used invalid invite link");
      authorizationStatus.cookies.delete(getAuthCookieName(clubSlug));
      return authorizationStatus;
    }
  }

  asyncLog("error", "Nothing matched, redirecting to unauthorized page");
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
