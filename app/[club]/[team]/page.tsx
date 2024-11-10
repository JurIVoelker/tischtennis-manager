import GameCard from "@/components/game-card";
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
        include: {
          players: true,
          matches: {
            include: {
              locations: true,
            },
          },
        },
      },
    },
  });

  const { players, matches } = club?.teams[0] || {};

  return (
    <div className="flex flex-col gap-8 p-6">
      <PlayersCard players={players} />
      <div>
        {matches &&
          matches.map((match) => {
            const location = match.locations[0];
            return <GameCard match={match} location={location} />;
          })}
      </div>
    </div>
  );
};

export default ClubTeamPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
