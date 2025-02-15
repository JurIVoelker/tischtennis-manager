import {
  API_DELETE_LEADER_SCHEMA,
  API_POST_LEADER_SCHEMA,
  API_PUT_LEADER_EMAIL_SCHEMA,
  validateSchema,
} from "@/constants/zodSchemaConstants";
import { handleGetBody } from "@/lib/APIUtils";
import { prisma } from "@/lib/prisma/prisma";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

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
  } = await validateSchema(API_PUT_LEADER_EMAIL_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    leaderId,
    email,
    name,
    clubSlug,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  // const loggedinUserData = await getToken({
  //   req: request,
  //   secret: process.env.NEXTAUTH_SECRET,
  // });
  // const { email } = loggedinUserData || {};
  // let isTeamLeader = false;
  // if (email) {
  //   isTeamLeader = (await getLeaderData(clubSlug, teamSlug, email))
  //     .isTeamLeader;
  // }

  // if (!isTeamLeader) {
  //   return new Response(INVALID_TOKEN_ERROR, { status: 401 });
  // }

  await prisma.$transaction(async (tx) => {
    if (email) {
      await tx.teamLeader.update({
        where: { id: leaderId },
        data: { email },
      });
    }
    console.log(name);
    if (name) {
      await tx.teamLeader.update({
        where: { id: leaderId },
        data: { fullName: name },
      });
    }
  });

  revalidatePath(`${clubSlug}/admin/mannschaftsfuehrer`);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
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
  } = await validateSchema(API_DELETE_LEADER_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    leaderId,
    clubSlug,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  await prisma.teamLeader.delete({ where: { id: leaderId } });
  revalidatePath(`${clubSlug}/admin/mannschaftsfuehrer`);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}

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
  } = await validateSchema(API_POST_LEADER_SCHEMA, body || {});

  if (!isSchemaSuccess) {
    return invalidSchemaResponse;
  }

  const {
    teamId,
    email,
    fullName,
    clubSlug,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  await prisma.teamLeader.create({ data: { email, fullName, teamId } });
  revalidatePath(`${clubSlug}/admin/mannschaftsfuehrer`);

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
