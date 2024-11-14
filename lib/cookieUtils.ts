import { NextRequest, NextResponse } from "next/server";

export const getAuthCookieName = (clubSlug: string) =>
  `auth_tokens_${clubSlug}`;

const getAllCookieTokens = (request: NextRequest, clubSlug: string) => {
  const cookieValue = request.cookies.get(getAuthCookieName(clubSlug))?.value;
  if (!cookieValue) return null;
  let teamCookieValues;
  try {
    teamCookieValues = JSON.parse(cookieValue);
    if (!teamCookieValues) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return null;
  }
  return teamCookieValues;
};

export const setTeamTokenCookie = (
  request: NextRequest,
  response: NextResponse,
  clubSlug: string,
  teamSlug: string,
  token: string
) => {
  const allTokens = getAllCookieTokens(request, clubSlug) || {};
  allTokens[teamSlug] = token;
  response.cookies.set(getAuthCookieName(clubSlug), JSON.stringify(allTokens), {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 90 * 24 * 60 * 60,
  });
  return response;
};

export const getAuthCookies = (
  request: NextRequest,
  clubSlug: string,
  teamSlug: string
): {
  token: string | null;
  allTokens?: string[];
} => {
  const cookieValues = getAllCookieTokens(request, clubSlug);
  if (!cookieValues) return { token: null };
  return {
    token: cookieValues[teamSlug],
    allTokens: Object.values(cookieValues),
  };
};
