import axios from "axios";
import { NextRequest } from "next/server";

export type LogLevels =
  | "info"
  | "warn"
  | "error"
  | "http"
  | "verbose"
  | "debug"
  | "silly";

export const asyncLog = (
  request: NextRequest,
  level: LogLevels,
  message: string
) => {
  const basePath = request.nextUrl.href.split("/").slice(0, 3).join("/");
  axios
    .post(`${basePath}/api/log`, { status: level, message })
    .catch((error) => {
      console.error("Failed to log message", error);
    });
};
