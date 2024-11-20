import { LogLevels } from "@/lib/logUtils";
import logger from "@/logs/logger";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const status: LogLevels = body.status;
  const message: string = body.message;

  const possibleStatuses = [
    "info",
    "warn",
    "error",
    "http",
    "verbose",
    "debug",
    "silly",
  ];

  if (!message) {
    return new Response("Message is required", { status: 400 });
  }

  if (!possibleStatuses.includes(status)) {
    return new Response("Invalid status", { status: 400 });
  }

  try {
    logger[status](message);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return new Response("error", { status: 500 });
  }

  return new Response("success", { status: 200 });
}
