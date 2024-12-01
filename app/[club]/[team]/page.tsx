export const dynamicParams = false;
import GameCard from "@/components/game-card/game-card";
import NewGame from "@/components/game-card/new-game-card";
import TeamLeaderJoinSuggestion from "@/components/leader-no-member-promt";
import Navbar from "@/components/navbar";
import PlayersCard from "@/components/players-card";
import Typography from "@/components/typography";
import { asyncLog } from "@/lib/logUtils";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { getOrderedPlayers, sortLineupsOfMatches } from "@/lib/prismaUtils";
import { ClubWithTeamsWithoutMatches } from "@/types/prismaTypes";

const ClubTeamPage = async ({
  params,
}: {
  params: Promise<ClubTeamParams>;
}) => {
  const { clubSlug, teamSlug } = await decodeClubTeamParams(params);

  const club: ClubWithTeamsWithoutMatches = await prisma.club.findUnique({
    where: { slug: clubSlug },
    include: {
      teams: {
        include: {
          matches: {
            include: {
              location: true,
              lineups: {
                include: {
                  player: true,
                },
              },
            },
          },
        },
        where: {
          slug: teamSlug,
        },
      },
    },
  });

  if (club?.teams && club?.teams?.length >= 2) {
    asyncLog("error", `${clubSlug} has more than one team with the same name`);
  }

  const players = await getOrderedPlayers(club?.teams[0].id || "");

  const { matches, name: teamName } =
    club?.teams?.find((team) => team.slug === teamSlug) || {};

  const upcomingMatches = matches?.filter(
    (match) => new Date(match.matchDateTime) >= new Date()
  );

  const matchesWithSortedLineups = sortLineupsOfMatches(
    upcomingMatches || [],
    players
  );

  return (
    <>
      <div className="w-full">
        <Navbar title={teamName} />
        <div className="px-6 pb-6 pt-16 ">
          <PlayersCard
            players={players}
            className="mb-8"
            clubSlug={clubSlug}
            teamSlug={teamSlug}
          />
          <TeamLeaderJoinSuggestion clubSlug={clubSlug} teamSlug={teamSlug} />
          {matchesWithSortedLineups && teamName && (
            <div className="flex flex-col gap-8 md:grid md:grid-cols-2 xl:grid-cols-3">
              {matchesWithSortedLineups.map((match, id) => {
                const isLineup = Boolean(match.lineups.length);
                return (
                  <GameCard
                    teamSlug={teamSlug}
                    teamName={teamName}
                    match={match}
                    isLineup={isLineup}
                    key={id}
                  />
                );
              })}
              {!matchesWithSortedLineups.length && (
                <Typography variant="p-gray">Keine Spiele gefunden</Typography>
              )}
              <NewGame teamSlug={teamSlug} />
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
