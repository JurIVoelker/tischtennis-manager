import ManagePlayersHeader from "@/components/manage-players/manage-players-header";
import { PlayerTable } from "@/components/manage-players/player-table";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { getOrderedPlayers } from "@/lib/prismaUtils";
import { PlusSignIcon } from "hugeicons-react";

const ManagePlayersPage = async ({
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
      <Navbar title="Spieler verwalten" />
      <div className="px-6 pb-6 pt-16 ">
        <ManagePlayersHeader clubSlug={clubSlug} teamSlug={teamSlug} />
        <PlayerTable className="mt-16" players={players} />
        <Button className="w-full mt-6" variant="outline">
          <PlusSignIcon />
          Spieler hinzufügen
        </Button>
      </div>
    </div>
  );
};

export default ManagePlayersPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
