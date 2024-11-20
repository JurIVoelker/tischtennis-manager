import Navbar from "@/components/navbar";
import SortPlayersHeader from "@/components/sort-players/sort-players-header";
import { SortablePlayerTable } from "@/components/sort-players/sortable-player-table";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";

const SortPlayersPage = async ({
  params,
}: {
  params: Promise<ClubTeamParams>;
}) => {
  const { clubSlug, teamSlug } = await decodeClubTeamParams(params);

  const club = await prisma.club.findFirst({
    where: {
      slug: clubSlug,
    },
    include: {
      teams: {
        include: {
          players: true,
        },
        where: {
          slug: teamSlug,
        },
      },
    },
  });

  const players = club?.teams[0].players;

  return (
    <div className="w-full">
      <Navbar title="Spieler sortieren" />
      <div className="px-6 pb-6 pt-16 ">
        <SortPlayersHeader />
        <SortablePlayerTable className="mt-16" players={players} />
      </div>
    </div>
  );
};

export default SortPlayersPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
