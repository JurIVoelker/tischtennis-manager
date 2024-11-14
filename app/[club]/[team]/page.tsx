export const dynamicParams = false;
import GameCard from "@/components/game-card";
import Navbar from "@/components/navbar";
import PlayersCard from "@/components/players-card";
import Typography from "@/components/typography";
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
    where: { slug: clubSlug },
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

  const {
    players,
    matches,
    name: teamName,
  } = club?.teams?.find((team) => team.slug === teamSlug) || {};

  return (
    <>
      <div className="w-full">
        <Navbar title={teamName} />
        <div className="px-6 pb-6 pt-16 ">
          <PlayersCard players={players} className="mb-8" />
          {matches && teamName && (
            <div className="flex flex-col gap-8 md:grid md:grid-cols-2 xl:grid-cols-3">
              {matches.map((match, id) => {
                const location = match.locations[0];
                const isLineup = Boolean(match.lineups.length);
                return (
                  <GameCard
                    teamName={teamName}
                    match={match}
                    location={location}
                    isLineup={isLineup}
                    key={id}
                  />
                );
              })}
              {!matches.length && (
                <Typography variant="p-gray">Keine Spiele gefunden</Typography>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClubTeamPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
