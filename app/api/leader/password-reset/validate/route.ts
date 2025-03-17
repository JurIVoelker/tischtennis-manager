import {
  PASSWORD_RESET_EXPIRED_ERROR,
  PASSWORD_RESET_NOT_FOUND_ERROR,
} from "@/constants/APIError";
import { API_POST_PASSWORD_RESET_VALIDATE_SCHEMA } from "@/constants/zodSchemaConstants";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma/prisma";
import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["user:all"],
    API_POST_PASSWORD_RESET_VALIDATE_SCHEMA
  );

  if (response) return response;

  const { email, password, token } = body as {
    email: string;
    password: string;
    token: string;
  };

  const credentials = await prisma.userCredentials.findFirst({
    where: {
      email: email,
    },
  });

  if (!credentials) {
    console.error("No credentials found for email", email);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const reset = await prisma.passwordReset.findFirst({
    where: {
      email,
      token,
    },
  });

  if (!reset) {
    console.error("No reset found for email", email, "and token", token);
    return new Response(
      JSON.stringify({ ok: false, error: PASSWORD_RESET_NOT_FOUND_ERROR }),
      { status: 400 }
    );
  }

  if (reset.expiresAt < new Date()) {
    await prisma.passwordReset.delete({
      where: {
        id: reset.id,
      },
    });

    return new Response(
      JSON.stringify({ ok: false, error: PASSWORD_RESET_EXPIRED_ERROR }),
      {
        status: 400,
      }
    );
  }

  const passwordHash = hashPassword(password);

  await prisma.userCredentials.update({
    where: {
      email,
    },
    data: {
      passwordHash,
    },
  });

  await prisma.passwordReset.deleteMany({
    where: {
      email,
    },
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
