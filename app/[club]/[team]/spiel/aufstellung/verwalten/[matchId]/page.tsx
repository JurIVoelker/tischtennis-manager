import Navbar from "@/components/navbar";
import {
  decodeMatchPageParams,
  MatchPageParams,
  generateEditMatchParams as generateParamsWithMatchId,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { getOrderedPlayers } from "@/lib/prismaUtils";
import { notFound } from "next/navigation";

const ManageLineup = async ({
  params,
}: {
  params: Promise<MatchPageParams>;
}) => {
  const { matchId } = await decodeMatchPageParams(params);

  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      lineups: {
        orderBy: {
          position: "asc",
        },
      },
      team: true,
    },
  });

  const orderedPlayers = await getOrderedPlayers(match?.team.id || "");

  if (!match) {
    notFound();
  }

  return (
    <div className="w-full">
      <Navbar title="Aufstellung anpassen" />
      <div className="px-6 pb-6 pt-16 space-y-6"></div>
    </div>
  );
};

export default ManageLineup;

export async function generateStaticParams() {
  return await generateParamsWithMatchId();
}
