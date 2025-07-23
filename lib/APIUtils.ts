import { GetTeamAuthResponseInterface } from "@/app/api/protected/team-auth/route";
import { asyncLog } from "./logUtils";
import qs from "qs";
import axios from "axios";
import { NextRequest } from "next/server";
import { BODY_NOT_JSON_ERROR, INVALID_TOKEN_ERROR } from "@/constants/APIError";
import { getToken } from "next-auth/jwt";

export const getValidToken = async (
  clubSlug: string,
  teamSlug: string
): Promise<GetTeamAuthResponseInterface> => {
  let tokenData;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await getAPI(`${baseUrl}/api/protected/team-auth`, {
      query: { clubSlug, teamSlug },
      headers: { Cookie: "server-token=" + process.env.SERVER_API_TOKEN },
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
    }/api/protected/is-team-leader?clubSlug=${clubSlug}&teamSlug=${teamSlug}&email=${email}`,
    { headers: { Cookie: "server-token=" + process.env.SERVER_API_TOKEN } }
  );
  return res?.data;
};

export const getAdminData = async (clubSlug: string, email: string) => {
  try {
    const res = await axios.get(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/protected/is-admin?clubSlug=${clubSlug}&email=${email}`,
      { headers: { Cookie: "server-token=" + process.env.SERVER_API_TOKEN } }
    );
    return res?.data;
  } catch (error) {
    console.error(error);
    return {};
  }
};

export const getAPI = async (
  url: string,
  options: { query?: object; headers?: object } = {}
) => {
  const isLogging = process.env.NODE_ENV === "development";
  const { query, headers } = options || {};
  const queryString = query ? qs.stringify(query) : "";

  const requestUrl = url + (queryString ? `?${queryString}` : "");

  if (isLogging) console.info(`[GET] -> ${requestUrl}`);
  const response = await fetch(requestUrl, {
    headers: { ...headers },
  });
  if (!response.ok) {
    if (isLogging) console.info(`[ERROR-${response.status}] -> ${requestUrl}`);
    return null;
  }
  const data = await response.json();
  return data;
};

const makeRequest = async (
  method: "POST" | "PUT" | "DELETE",
  url: string,
  body: object,
  options: { query?: object; headers?: object } = {}
) => {
  const isLogging = process.env.NODE_ENV === "development";
  const { query, headers } = options || {};
  const queryString = query ? qs.stringify(query) : "";

  const requestUrl = url + (queryString ? `?${queryString}` : "");

  if (isLogging) console.info(`[${method}] -> ${requestUrl}`);
  const response = await fetch(requestUrl, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });

  let json = "";
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    json = await response.json();
  } else {
    json = await response.text();
    try {
      json = JSON.parse(json);
    } catch {}
  }
  if (!response.ok) {
    if (isLogging) console.info(`[ERROR-${response.status}] -> ${requestUrl}`);
    return { ...response, error: json };
  }

  return { ok: true, error: false, data: json };
};

export const postAPI = async (url: string, body: object, options?: object) => {
  return await makeRequest("POST", url, body, options);
};

export const putAPI = async (url: string, body: object, options?: object) => {
  return await makeRequest("PUT", url, body, options);
};

export const deleteAPI = async (
  url: string,
  body: object,
  options?: object
) => {
  return await makeRequest("DELETE", url, body, options);
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
): Promise<{
  success: boolean;
  responseReturnValue?: Response;
  someLeader?: boolean;
}> => {
  let someLeader = false;
  const loggedinUserData = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { email } = loggedinUserData || {};
  let isTeamLeader = false;
  if (email) {
    const res = await getLeaderData(clubSlug, teamSlug, email);
    isTeamLeader = res.isTeamLeader;
    someLeader = res.isSomeLeader;
  }

  if (!isTeamLeader && !someLeader) {
    return {
      success: false,
      responseReturnValue: new Response(
        JSON.stringify([{ message: INVALID_TOKEN_ERROR }]),
        { status: 401 }
      ),
    };
  }
  return { success: true, someLeader };
};

export const hasAdminPermission = async (
  clubSlug: string,
  request: NextRequest
): Promise<{ success: boolean; responseReturnValue?: Response }> => {
  const loggedinUserData = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { email } = loggedinUserData || {};
  let isAdmin = false;
  if (email) {
    isAdmin = (await getAdminData(clubSlug, email)).isAdmin;
  }

  if (!isAdmin) {
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
