import { AppSidebar } from "@/components/app-sidebar";
import GameCard from "@/components/game-card";
import Navbar from "@/components/navbar";
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
              lineups: true,
            },
          },
        },
      },
    },
  });

  const { players, matches, name: teamName } = club?.teams[0] || {};

  return (
    <>
      <Navbar title={teamName} />
      <AppSidebar clubSlug={clubSlug} teamSlug={teamSlug} />
      <div className="flex flex-col gap-8 px-6 pb-6 pt-16">
        <PlayersCard players={players} />
        {matches &&
          matches.map((match, id) => {
            const location = match.locations[0];
            const isLineup = Boolean(match.lineups.length);
            return (
              <GameCard
                match={match}
                location={location}
                isLineup={isLineup}
                key={id}
              />
            );
          })}
      </div>
    </>
  );
};

export default ClubTeamPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
