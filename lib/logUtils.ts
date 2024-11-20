import axios from "axios";

export type LogLevels =
  | "info"
  | "warn"
  | "error"
  | "http"
  | "verbose"
  | "debug"
  | "silly";

export const log = (level: LogLevels, message: string) => {
  axios.post("/api/log", { status: level, message }).catch((error) => {
    console.error("Failed to log message", error);
  });
};
