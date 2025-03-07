import Headline from "@/components/headline";
import Navbar from "@/components/navbar";
import SortPlayersTableWrapper from "@/components/sort-players-table-wrapper";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { getOrderedPlayers } from "@/lib/prismaUtils";

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
        where: {
          slug: teamSlug,
        },
      },
    },
  });

  const { id: teamId } = club?.teams[0] || {};
  const players = await getOrderedPlayers(teamId);

  return (
    <div className="w-full">
      <Navbar />
      <div className="px-6 pb-6 pt-16 ">
        <Headline>Spieler sortieren</Headline>
        <SortPlayersTableWrapper
          defaultPlayers={players}
          clubSlug={clubSlug}
          teamSlug={teamSlug}
        />
      </div>
    </div>
  );
};

export default SortPlayersPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
