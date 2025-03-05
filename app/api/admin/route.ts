import {
  API_DELETE_ADMIN_SCHEMA,
  API_POST_ADMIN_SCHEMA,
  API_PUT_ADMIN_SCHEMA,
} from "@/constants/zodSchemaConstants";
import { prisma } from "@/lib/prisma/prisma";
import { validateAdminId, validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["admin"],
    API_POST_ADMIN_SCHEMA
  );

  if (response) return response;

  const {
    clubSlug,
    fullName,
    email,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  const res = await prisma.owner.create({
    data: {
      email,
      club: {
        connect: {
          slug: clubSlug,
        },
      },
      fullName,
    },
  });
  revalidatePath(`/${clubSlug}/admin/verwalten`);
  return new Response(JSON.stringify({ ok: true, data: res }), { status: 200 });
}

export async function PUT(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["admin"],
    API_PUT_ADMIN_SCHEMA
  );

  if (response) return response;

  const {
    clubSlug,
    adminId,
    fullName,
    email,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;
  const isAdminValid = await validateAdminId(clubSlug, adminId);
  if (!isAdminValid.success) {
    return new Response(JSON.stringify({ error: isAdminValid.data }), {
      status: 400,
    });
  }

  const res = await prisma.owner.update({
    where: {
      id: adminId,
    },
    data: {
      email,
      fullName,
    },
  });
  revalidatePath(`/${clubSlug}/admin/verwalten`);
  return new Response(JSON.stringify({ ok: true, data: res }), { status: 200 });
}

export async function DELETE(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["admin"],
    API_DELETE_ADMIN_SCHEMA
  );

  if (response) return response;

  const {
    clubSlug,
    adminId,
  }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any = body;

  const isAdminValid = await validateAdminId(clubSlug, adminId);
  if (!isAdminValid.success) {
    return new Response(JSON.stringify({ error: isAdminValid.data }), {
      status: 400,
    });
  }

  const res = await prisma.owner.delete({
    where: {
      id: adminId,
    },
  });
  revalidatePath(`/${clubSlug}/admin/verwalten`);
  return new Response(JSON.stringify({ ok: true, data: res }), { status: 200 });
}
