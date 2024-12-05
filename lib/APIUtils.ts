import { GetTeamAuthResponseInterface } from "@/app/api/protected/team-auth/route";
import { asyncLog } from "./logUtils";
import qs from "qs";
import axios from "axios";
import { NextRequest } from "next/server";
import { BODY_NOT_JSON_ERROR, INVALID_TOKEN_ERROR } from "@/constants/APIError";
import { getToken } from "next-auth/jwt";
import { getAuthCookies } from "./cookieUtils";

export const getValidToken = async (
  clubSlug: string,
  teamSlug: string
): Promise<GetTeamAuthResponseInterface> => {
  let tokenData;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetchAPI(`${baseUrl}/api/protected/team-auth`, {
      clubSlug,
      teamSlug,
    });
    tokenData = res;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.response?.status !== 404) {
      asyncLog(
        "error",
        `There was an unexpected error for fetching the token serverside for ${clubSlug}/${teamSlug}: ${
          error?.response?.message || error?.message
        }`
      );
      console.error(error);
    }
    return { token: null, allTokens: [] };
  }
  return tokenData;
};

export const getLeaderData = async (
  clubSlug: string,
  teamSlug: string,
  email: string
) => {
  const res = await axios.get(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/protected/is-team-leader?clubSlug=${clubSlug}&teamSlug=${teamSlug}&email=${email}`
  );
  return res?.data;
};

export const fetchAPI = async (url: string, options?: object) => {
  const isLogging = process.env.NODE_ENV === "development";
  const queryString = options ? qs.stringify(options) : "";

  const requestUrl = url + (queryString ? `?${queryString}` : "");

  if (isLogging) console.info(`[GET] -> ${requestUrl}`);
  const response = await fetch(requestUrl);
  if (!response.ok) {
    if (isLogging) console.info(`[ERROR-${response.status}] -> ${requestUrl}`);
    return null;
  }
  const data = await response.json();
  return data;
};

const makeRequest = async (
  method: "POST" | "PUT",
  url: string,
  body: object,
  options?: object
) => {
  const isLogging = process.env.NODE_ENV === "development";
  const queryString = options ? qs.stringify(options) : "";

  const requestUrl = url + (queryString ? `?${queryString}` : "");

  if (isLogging) console.info(`[${method}] -> ${requestUrl}`);
  const response = await fetch(requestUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    if (isLogging) console.info(`[ERROR-${response.status}] -> ${requestUrl}`);
    let json;
    try {
      json = await response.json();
    } catch {
      const res = await response.text();
      try {
        json = JSON.parse(res);
      } catch {
        json = res;
      }
    }
    return { ...response, error: json };
  }

  return { ok: true, error: false };
};

export const postAPI = async (url: string, body: object, options?: object) => {
  return await makeRequest("POST", url, body, options);
};

export const putAPI = async (url: string, body: object, options?: object) => {
  return await makeRequest("PUT", url, body, options);
};

export const handleGetBody = async (
  request: NextRequest
): Promise<{
  success: boolean;
  body?: unknown;
  responseReturnValue?: Response;
}> => {
  let body;
  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      responseReturnValue: new Response(BODY_NOT_JSON_ERROR, { status: 400 }),
    };
  }
  return { success: true, body };
};

export const hasLeaderPermission = async (
  clubSlug: string,
  teamSlug: string,
  request: NextRequest
): Promise<{ success: boolean; responseReturnValue?: Response }> => {
  const loggedinUserData = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { email } = loggedinUserData || {};
  let isTeamLeader = false;
  if (email) {
    isTeamLeader = (await getLeaderData(clubSlug, teamSlug, email))
      .isTeamLeader;
  }

  if (!isTeamLeader) {
    const { token: userToken } = getAuthCookies(request, clubSlug, teamSlug);
    const { token } = await getValidToken(clubSlug, teamSlug);

    if (token !== userToken)
      return {
        success: false,
        responseReturnValue: new Response(
          JSON.stringify([{ message: INVALID_TOKEN_ERROR }]),
          { status: 401 }
        ),
      };
  }
  return { success: true };
};
