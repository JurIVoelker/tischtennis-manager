import { NextResponse } from "next/server";

export const teamCookieName = (clubSlug: string, teamSlug: string) =>
  `${clubSlug}_${teamSlug}_token`;

export const setTeamTokenCookie = (
  response: NextResponse,
  clubSlug: string,
  teamSlug: string,
  token: string
) => {
  response.cookies.set(teamCookieName(clubSlug, teamSlug), token, {
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "lax",
    maxAge: 90 * 24 * 60 * 60,
  });
};
