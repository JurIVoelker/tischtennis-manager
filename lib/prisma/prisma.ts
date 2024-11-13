// src/lib/prisma.ts
import { ERRORS } from "@/constants/prismaErrors";
import { PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export function handlePrismaError(error: unknown) {
  const {
    UNKNOWN_ERROR,
    DATABASE_USER_UNAUTHORIZED,
    NOT_FOUND,
    TIMEOUT_ERROR,
    DATABASE_ALREADY_EXISTS,
    PERMISSION_DENIED,
    DATABASE_CONNECTION_ERROR,
    DATABASE_INVALID_REQUEST,
    INVALID_VALUE,
    VERSION_NOT_SUPPORTED,
    VALUE_TOO_LONG,
    UNIQUE_CONSTRAINT_VIOLATION,
    FOREIGN_KEY_CONSTRAINT_FAILED,
    NULL_CONSTRAINT_VIOLATION,
    MIGRATION_ERROR,
    PARAMETER_LIMIT_EXCEEDED,
    TOO_MANY_REQUESTS,
    PLAN_LIMIT_REACHED,
    CONNECTION_LIMIT_EXCEEDED,
    SERVER_ERROR,
    PROJECT_DISABLED,
  } = ERRORS;
  if (!(error instanceof PrismaClientKnownRequestError)) {
    return new Response(UNKNOWN_ERROR, {
      status: 500,
    });
  }
  let errorMessage;
  let statusCode;
  if (["P1000"].includes(error.code)) {
    errorMessage = DATABASE_USER_UNAUTHORIZED;
    statusCode = 401;
  } else if (["P1001", "P1014", "P2021", "P2022"].includes(error.code)) {
    errorMessage = NOT_FOUND;
    statusCode = 404;
  } else if (["P1002", "P1008", "P2024"].includes(error.code)) {
    errorMessage = TIMEOUT_ERROR;
    statusCode = 408;
  } else if (["P1003"].includes(error.code)) {
    errorMessage = NOT_FOUND;
    statusCode = 404;
  } else if (["P1009"].includes(error.code)) {
    errorMessage = DATABASE_ALREADY_EXISTS;
    statusCode = 409;
  } else if (["P1010"].includes(error.code)) {
    errorMessage = PERMISSION_DENIED;
    statusCode = 403;
  } else if (["P1011"].includes(error.code)) {
    errorMessage = DATABASE_CONNECTION_ERROR;
    statusCode = 500;
  } else if (["P1012"].includes(error.code)) {
    errorMessage = DATABASE_INVALID_REQUEST;
    statusCode = 400;
  } else if (["P1013"].includes(error.code)) {
    errorMessage = INVALID_VALUE;
    statusCode = 400;
  } else if (["P1015"].includes(error.code)) {
    errorMessage = VERSION_NOT_SUPPORTED;
    statusCode = 505;
  } else if (["P2000"].includes(error.code)) {
    errorMessage = VALUE_TOO_LONG;
    statusCode = 400;
  } else if (["P2001", "P2005", "P2018"].includes(error.code)) {
    errorMessage = INVALID_VALUE;
    statusCode = 400;
  } else if (["P2002"].includes(error.code)) {
    errorMessage = UNIQUE_CONSTRAINT_VIOLATION;
    statusCode = 409;
  } else if (["P2003"].includes(error.code)) {
    errorMessage = FOREIGN_KEY_CONSTRAINT_FAILED;
    statusCode = 409;
  } else if (["P2011"].includes(error.code)) {
    errorMessage = NULL_CONSTRAINT_VIOLATION;
    statusCode = 400;
  } else if (["P2020"].includes(error.code)) {
    errorMessage = INVALID_VALUE;
    statusCode = 400;
  } else if (["P3000", "P3004", "P3006", "P3008"].includes(error.code)) {
    errorMessage = MIGRATION_ERROR;
    statusCode = 500;
  } else if (["P2026"].includes(error.code)) {
    errorMessage = DATABASE_INVALID_REQUEST;
    statusCode = 400;
  } else if (["P2029"].includes(error.code)) {
    errorMessage = PARAMETER_LIMIT_EXCEEDED;
    statusCode = 400;
  } else if (["P5011"].includes(error.code)) {
    errorMessage = TOO_MANY_REQUESTS;
    statusCode = 429;
  } else if (["P6003"].includes(error.code)) {
    errorMessage = PLAN_LIMIT_REACHED;
    statusCode = 402;
  } else if (["P6006"].includes(error.code)) {
    errorMessage = VERSION_NOT_SUPPORTED;
    statusCode = 505;
  } else if (["P6008"].includes(error.code)) {
    errorMessage = CONNECTION_LIMIT_EXCEEDED;
    statusCode = 429;
  } else if (["P6100", "P6104"].includes(error.code)) {
    errorMessage = SERVER_ERROR;
    statusCode = 500;
  } else if (["P6102", "P6103", "P6105"].includes(error.code)) {
    errorMessage = PROJECT_DISABLED;
    statusCode = 403;
  } else {
    errorMessage = UNKNOWN_ERROR;
    statusCode = 500;
  }
  return new Response(`${errorMessage} [Fehler Code ${error.code}]`, {
    status: statusCode,
  });
}
