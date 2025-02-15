import {
  API_DELETE_LEADER_INVITE_TOKEN_SCHEMA,
  API_POST_LEADER_INVITE_TOKEN_SCHEMA,
  API_PUT_LEADER_INVITE_TOKEN_SCHEMA,
  timeLimitMap,
  validateSchema,
} from "@/constants/zodSchemaConstants";
import { handleGetBody } from "@/lib/APIUtils";
import { prisma } from "@/lib/prisma/prisma";
import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const {
    success: isBodySuccess,
    body,
    responseReturnValue: invalidBodyResponse,
  } = await handleGetBody(request);
  if (!isBodySuccess) return invalidBodyResponse;

  const {
    success: isSchemaSuccess,
    responseReturnValue: invalidSchemaResponse,
  } = await validateSchema(API_POST_LEADER_INVITE_TOKEN_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    clubSlug,
    teamSlug,
    email,
    timeLimit,
    name,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  const inviteToken = createHash("sha256")
    .update(
      clubSlug + teamSlug + email + timeLimit + name + Math.random().toString()
    )
    .digest("hex");

  const club = await prisma.club.findMany({
    where: {
      slug: clubSlug,
    },
    include: {
      teams: {
        where: {
          slug: teamSlug,
        },
      },
    },
  });

  const teamId = club[0]?.teams[0]?.id;
  if (!teamId) {
    return new Response("Team not found", { status: 404 });
  }

  const expiresAt = timeLimitMap[timeLimit]
    ? new Date(Date.now() + timeLimitMap[timeLimit])
    : new Date(Date.now() + timeLimitMap["infinite"]);

  await prisma.teamLeaderInvite.create({
    data: {
      email,
      fullName: name,
      teamId,
      expiresAt,
      token: inviteToken,
    },
  });

  revalidatePath(`${clubSlug}/admin/mannschaftsfuehrer`);

  return new Response(JSON.stringify({ ok: true, token: inviteToken }), {
    status: 200,
  });
}

export async function DELETE(request: NextRequest) {
  const {
    success: isBodySuccess,
    body,
    responseReturnValue: invalidBodyResponse,
  } = await handleGetBody(request);
  if (!isBodySuccess) return invalidBodyResponse;

  const {
    success: isSchemaSuccess,
    responseReturnValue: invalidSchemaResponse,
  } = await validateSchema(API_DELETE_LEADER_INVITE_TOKEN_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    clubSlug,
    id,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;
  await prisma.teamLeaderInvite.delete({
    where: {
      id,
    },
  });

  revalidatePath(`${clubSlug}/admin/mannschaftsfuehrer`);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
  });
}

export async function PUT(request: NextRequest) {
  const {
    success: isBodySuccess,
    body,
    responseReturnValue: invalidBodyResponse,
  } = await handleGetBody(request);
  if (!isBodySuccess) return invalidBodyResponse;

  const {
    success: isSchemaSuccess,
    responseReturnValue: invalidSchemaResponse,
  } = await validateSchema(API_PUT_LEADER_INVITE_TOKEN_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    clubSlug,
    expiresAt,
    id,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  await prisma.teamLeaderInvite.update({
    where: {
      id,
    },
    data: {
      expiresAt,
    },
  });

  revalidatePath(`${clubSlug}/admin/mannschaftsfuehrer`);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
  });
}
