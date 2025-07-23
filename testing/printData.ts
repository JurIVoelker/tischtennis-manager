import { prisma } from "@/lib/prisma/prisma";

const exec = async () => {
  return await prisma.team.findMany();
};

exec().then((res) => console.info(res));
