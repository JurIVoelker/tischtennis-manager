import { GetTeamAuthResponseInterface } from "@/app/api/protected/team-auth/route";
import { asyncLog } from "./logUtils";
import qs from "qs";
import axios from "axios";

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

export const postAPI = async (url: string, body: object, options?: object) => {
  const isLogging = process.env.NODE_ENV === "development";
  const queryString = options ? qs.stringify(options) : "";

  const requestUrl = url + (queryString ? `?${queryString}` : "");

  if (isLogging) console.info(`[POST] -> ${requestUrl}`);
  const response = await fetch(requestUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    if (isLogging) console.info(`[ERROR-${response.status}] -> ${requestUrl}`);
    const contentType = response.headers.get("content-type");
    let error;
    if (contentType && contentType.indexOf("application/json") !== -1) {
      error = await response.json();
    } else {
      error = await response.text();
    }
    return { ...response, error };
  }
  const data = await response.json();
  return data;
};
