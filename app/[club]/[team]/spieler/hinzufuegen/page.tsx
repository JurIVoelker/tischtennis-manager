import AddPlayersWrapper from "@/components/add-players-wrapper";
import Navbar from "@/components/navbar";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { getOrderedPlayers } from "@/lib/prismaUtils";
import { Team } from "@prisma/client";

const AddPlayersPage = async ({
  params,
}: {
  params: Promise<ClubTeamParams>;
}) => {
  const { clubSlug, teamSlug } = await decodeClubTeamParams(params);

  const club = await prisma.club.findUnique({
    where: {
      slug: clubSlug,
    },
    include: {
      teams: true,
    },
  });

  const { teams } = club || { teams: [] };
  const teamsWithoutOwn = teams.filter((team: Team) => team.slug !== teamSlug);

  const teamsWithOrderedPlayers = [];
  for (const team of teamsWithoutOwn || []) {
    const players = await getOrderedPlayers(team.id);
    teamsWithOrderedPlayers.push({ ...team, players });
  }

  return (
    <div className="w-full">
      <Navbar title="Spieler hinzufügen" />
      <div className="px-6 pb-6 pt-16 ">
        <AddPlayersWrapper teams={teamsWithOrderedPlayers} />
      </div>
    </div>
  );
};

export default AddPlayersPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
