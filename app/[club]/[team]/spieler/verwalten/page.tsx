import Headline from "@/components/headline";
import ManagePlayersHeader from "@/components/manage-players/manage-players-header";
import { PlayerTable } from "@/components/manage-players/player-table";
import Navbar from "@/components/navbar";
import { buttonVariants } from "@/components/ui/button";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { getOrderedPlayers } from "@/lib/prismaUtils";
import { cn } from "@/lib/utils";
import { PlusSignIcon } from "hugeicons-react";
import Link from "next/link";

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
      <Navbar />
      <div className="px-6 pb-6 pt-16 ">
        <Headline>Spieler verwalten</Headline>
        <ManagePlayersHeader clubSlug={clubSlug} teamSlug={teamSlug} />
        <PlayerTable
          className="mt-16"
          players={players}
          clubSlug={clubSlug}
          teamSlug={teamSlug}
        />
        <Link
          className={cn(buttonVariants({ variant: "outline" }), "w-full mt-6")}
          href="./hinzufuegen"
        >
          <PlusSignIcon strokeWidth={2} />
          Spieler hinzufügen
        </Link>
      </div>
    </div>
  );
};

export default ManagePlayersPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
