import PlayersCard from "@/components/players-card";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";

const ClubTeamPage = async ({
  params,
}: {
  params: Promise<ClubTeamParams>;
}) => {
  const { clubSlug, teamSlug } = await decodeClubTeamParams(params);

  const club = await prisma.club.findUnique({
    where: { slug: clubSlug, teams: { some: { slug: teamSlug } } },
    include: {
      teams: {
        include: { players: true },
      },
    },
  });

  const { players } = club?.teams[0] || {};

  return (
    <div>
      <PlayersCard players={players} />
    </div>
  );
};

export default ClubTeamPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
