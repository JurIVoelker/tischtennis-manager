import axios from "axios";

export type LogLevels =
  | "info"
  | "warn"
  | "error"
  | "http"
  | "verbose"
  | "debug"
  | "silly";

export const asyncLog = (level: LogLevels, message: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const isDev = process.env.NODE_ENV === "development";

  axios
    .post(`${baseUrl}/api/log`, {
      status: level,
      message: `${isDev ? "(dev) " : ""}${message}`,
    })
    .catch((error) => {
      console.error("Failed to log message", error);
    });
};
