import GameCard from "@/components/game-card/game-card";
import NewGame from "@/components/game-card/new-game-card";
import Headline from "@/components/headline";
import TeamLeaderJoinSuggestion from "@/components/leader-no-member-prompt";
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
import { getOrderedPlayers } from "@/lib/prismaUtils";
import { notFound } from "next/navigation";

export const revalidate = 600;

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
          matches: {
            include: {
              location: true,
              lineups: {
                include: {
                  player: true,
                },
                orderBy: {
                  position: "asc",
                },
              },
              matchAvailabilityVotes: {
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

  if (!club?.teams) return notFound();

  if (club?.teams && club?.teams?.length >= 2) {
    asyncLog("error", `${clubSlug} has more than one team with the same name`);
  }

  const players = await getOrderedPlayers(club?.teams[0]?.id || "");

  const { matches, name: teamName } =
    club?.teams?.find((team) => team.slug === teamSlug) || {};

  const upcomingMatches = matches
    ?.filter((match) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(match.matchDateTime) >= today;
    })
    .sort(
      (a, b) =>
        new Date(a.matchDateTime).getTime() -
        new Date(b.matchDateTime).getTime()
    );

  return (
    <>
      <div className="w-full">
        <Navbar />
        <div className="px-6 pb-6 pt-16 ">
          <Headline>{teamName}</Headline>
          <PlayersCard
            players={players}
            className="mb-8"
            clubSlug={clubSlug}
            teamSlug={teamSlug}
          />
          <TeamLeaderJoinSuggestion clubSlug={clubSlug} teamSlug={teamSlug} />
          {upcomingMatches && teamName && (
            <div className="flex flex-col gap-6 md:grid md:grid-cols-2 xl:grid-cols-3">
              {upcomingMatches.map((match, id) => {
                const isLineup = Boolean(match.lineups.length);
                return (
                  <GameCard
                    teamSlug={teamSlug}
                    clubSlug={clubSlug}
                    matchAvailabilityVotes={match.matchAvailabilityVotes}
                    players={players}
                    match={match}
                    isLineup={isLineup}
                    key={id}
                  />
                );
              })}
              {!upcomingMatches.length && (
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
