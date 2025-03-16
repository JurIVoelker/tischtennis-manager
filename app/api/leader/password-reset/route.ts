import { API_POST_PASSWORD_RESET_SCHEMA } from "@/constants/zodSchemaConstants";
import { PasswordResetEmail } from "../../../../emails/ResetPassword";
import { prisma } from "@/lib/prisma/prisma";
import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";
import crypto from "crypto";
// import { sendEmail } from "@/lib/emailUtils";
import { render } from "@react-email/components";
import { sendEmail } from "@/lib/emailUtils";
import { TOO_MANY_EMAILS_SENT_ERROR } from "@/constants/APIError";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["user:all"],
    API_POST_PASSWORD_RESET_SCHEMA
  );

  if (response) return response;

  const { email, clubSlug } = body as {
    email: string;
    clubSlug: string;
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

  const resets = await prisma.passwordReset.findMany({
    where: {
      email,
    },
  });

  const finishedResets = resets.filter((reset) => reset.expiresAt < new Date());
  const unfinishedResets = resets.filter(
    (reset) => reset.expiresAt > new Date()
  );

  await prisma.passwordReset.deleteMany({
    where: {
      id: {
        in: finishedResets.map((reset) => reset.id),
      },
    },
  });

  if (unfinishedResets.length > 2) {
    console.error("Too many unfinished resets for email", email);
    // ! TODO: uncomment before merge
    // return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  const token = crypto.randomBytes(32).toString("hex");

  const emailsSentToday = await prisma.emailsSent.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });

  if (emailsSentToday >= 100) {
    return new Response(
      JSON.stringify({ ok: false, error: TOO_MANY_EMAILS_SENT_ERROR }),
      { status: 403 }
    );
  }

  const data = {
    email,
    username: credentials.email,
    companyName: "Tischtennis Manager",
    clubSlug,
  };

  await sendEmail({
    Email: PasswordResetEmail,
    to: email,
    subject: "Passwort zurücksetzen",
    data: {
      ...data,
      token,
    },
  });

  await prisma.passwordReset.create({
    data: {
      email,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  const logEmailHtml = await render(
    PasswordResetEmail({ ...data, token: "token" }),
    {
      plainText: true,
    }
  );

  await prisma.emailsSent.create({
    data: {
      email,
      body: logEmailHtml,
      subject: "Passwort zurücksetzen",
    },
  });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
