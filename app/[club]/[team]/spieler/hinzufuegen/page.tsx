import AddExistingPlayerDrawer from "@/components/add-existing-player-drawer";
import Navbar from "@/components/navbar";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { TeamWithPlayers } from "@/types/prismaTypes";

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
      teams: {
        include: {
          players: true,
        },
      },
    },
  });

  const { teams } = club || { teams: [] };
  const teamsWithoutOwn = teams.filter(
    (team: TeamWithPlayers) => team.slug !== teamSlug
  );

  return (
    <div className="w-full">
      <Navbar title="Spieler hinzufügen" />
      <div className="px-6 pb-6 pt-16 ">
        <AddExistingPlayerDrawer teams={teamsWithoutOwn} />
        {/* {teamsWithoutOwn.map((team) => JSON.stringify(team.players))} */}
      </div>
    </div>
  );
};

export default AddPlayersPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
