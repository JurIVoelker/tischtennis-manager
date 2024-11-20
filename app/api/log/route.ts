import logger from "@/logs/logger";
import { NextRequest } from "next/server";

type statusType =
  | "info"
  | "warn"
  | "error"
  | "http"
  | "verbose"
  | "debug"
  | "silly";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const status: statusType = body.status;
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
  } catch (error) {
    return new Response("error", { status: 500 });
  }

  return new Response("success", { status: 200 });
}
