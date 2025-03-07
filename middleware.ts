import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import {
  setTeamTokenCookie,
  getAuthCookieName,
  getAuthCookies as getUserAuthCookie,
} from "./lib/cookieUtils";
import { handleUnauthorizedUser } from "./lib/middlewareUtils";
import {
  getLeaderData,
  getValidToken,
  hasAdminPermission,
} from "./lib/APIUtils";
import { LOGIN_PAGE_REGEX } from "./constants/regex";
import { isIgnoredMiddlewarePath } from "./lib/routeUtils";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const urlPath = request.url.replace(/^https?:\/\/[^/]+/, "");
  if (isIgnoredMiddlewarePath(urlPath)) return NextResponse.next();

  const splitUrl = urlPath.split("/");
  const clubSlug = splitUrl.length > 0 ? splitUrl[1] : "";
  const teamSlug = splitUrl.length > 1 ? splitUrl[2] : "";

  if (urlPath.split("/").length <= 2) {
    return NextResponse.redirect(new URL(`/${clubSlug}/welcome`, request.url));
  }

  if (urlPath.split("/").length < 3) {
    return NextResponse.redirect(new URL(`/ungueltiger-link`, request.url));
  }

  /*
   * Check if user is admin of clubslug
   */

  const { success: isAdmin } = await hasAdminPermission(
    clubSlug as string,
    request
  );
  if (isAdmin) return NextResponse.next();

  /*
   * Get valid token serverside
   */

  const { token, allTokens } = (await getValidToken(clubSlug, teamSlug)) || {};

  if (token === null) {
    return NextResponse.redirect(new URL(`/${clubSlug}/welcome`, request.url));
  }

  /*
   * Check if user is team leader in any team of clubslug.
   */

  const loggedinUserData = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { email } = loggedinUserData || {};
  if (email) {
    const { isSomeLeader } = await getLeaderData(clubSlug, teamSlug, email);
    if (isSomeLeader) {
      return NextResponse.next();
    }
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
    allUserTokens.some((userToken) => allTokens?.includes(userToken))
  ) {
    return NextResponse.next();
  } else if (LOGIN_PAGE_REGEX.test(urlPath) && token === pageUserToken) {
    const response = NextResponse.next();
    setTeamTokenCookie(request, response, clubSlug, teamSlug, token);
    return response;
  } else if (!LOGIN_PAGE_REGEX.test(urlPath) && pageUserToken) {
    const response = NextResponse.redirect(
      new URL(`/${clubSlug}/welcome`, request.url)
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
      authorizationStatus.cookies.delete(getAuthCookieName(clubSlug));
      return authorizationStatus;
    }
  }

  return NextResponse.redirect(new URL(`/${clubSlug}/welcome`, request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|.*\\.js|icons/.*).*)",
  ],
};
