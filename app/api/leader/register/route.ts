import { API_POST_LEADER_REGISTER_SCHEMA } from "@/constants/zodSchemaConstants";
import { prisma } from "@/lib/prisma/prisma";
import { validateRequest } from "@/lib/serversideAPIUtils";
import { NextRequest } from "next/server";
import { hashPassword } from "@/lib/auth";
import {
  LEADER_IS_NOT_EXISTING,
  TEAM_LEADER_ALREADY_EXISTS_ERROR,
} from "@/constants/APIError";

export async function POST(request: NextRequest) {
  const { response, body } = await validateRequest(
    request,
    ["user:all"],
    API_POST_LEADER_REGISTER_SCHEMA
  );

  if (response) return response;

  const { email, password, clubSlug } = body as {
    email: string;
    password: string;
    clubSlug: string;
  };

  const addedLeader = await prisma.teamLeader.findFirst({
    where: {
      email,
      team: {
        club: {
          slug: clubSlug,
        },
      },
    },
  });

  const addedAdmin = await prisma.owner.findFirst({
    where: {
      email,
      club: {
        slug: clubSlug,
      },
    },
  });

  if (!addedLeader && !addedAdmin) {
    return new Response(
      JSON.stringify({ ok: false, error: LEADER_IS_NOT_EXISTING }),
      { status: 400 }
    );
  }

  const passwordHash = hashPassword(password);

  try {
    await prisma.userCredentials.create({
      data: {
        email,
        passwordHash,
      },
    });
  } catch (error) {
    console.error(error);
    // @ts-expect-error error is not typed
    if (error?.code === "P2002") {
      return new Response(
        JSON.stringify({ ok: false, error: TEAM_LEADER_ALREADY_EXISTS_ERROR }),
        { status: 400 }
      );
    }
    return new Response(JSON.stringify({ ok: false, error }), { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
