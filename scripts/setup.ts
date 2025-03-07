import { prisma } from "@/lib/prisma/prisma";
import "dotenv/config";
import { z } from "zod";

const clubSlug = process.env.CLUB_SLUG;
const clubInitialAdminEmail = process.env.CLUB_INITIAL_ADMIN_EMAIL;
const clubName = process.env.CLUB_NAME;

const schema = z.object({
  clubSlug: z.string().nonempty(),
  clubInitialAdminEmail: z.string().email(),
  clubName: z.string().nonempty(),
});

const schemaValid = schema.safeParse({
  clubSlug,
  clubInitialAdminEmail,
  clubName,
});

if (!schemaValid.success) {
  throw new Error(
    "Invalid environment variables: " + JSON.stringify(schemaValid.error.errors)
  );
}

const exec = async () => {
  const clubCount = await prisma.club.count();
  if (clubCount > 0) {
    throw new Error("A club already exists");
  }
  const res = await prisma.club.create({
    data: {
      slug: clubSlug || "",
      name: clubName || "",
      owners: {
        create: {
          email: clubInitialAdminEmail || "",
          fullName: "INITIAL_ADMIN",
        },
      },
    },
  });
  console.log("Created initial Club: " + JSON.stringify(res));
  console.log(
    `Visit page: ${process.env.NEXT_PUBLIC_BASE_URL || "url"}/${clubSlug}`
  );
};

exec();
