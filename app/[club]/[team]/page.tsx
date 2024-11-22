export const dynamicParams = false;
import GameCard from "@/components/game-card/game-card";
import Navbar from "@/components/navbar";
import PlayersCard from "@/components/players-card";
import Typography from "@/components/typography";
import { Card } from "@/components/ui/card";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { ClubWithTeams } from "@/types/prismaTypes";
import { Add01Icon } from "hugeicons-react";
import Link from "next/link";

const ClubTeamPage = async ({
  params,
}: {
  params: Promise<ClubTeamParams>;
}) => {
  const { clubSlug, teamSlug } = await decodeClubTeamParams(params);

  const club: ClubWithTeams = await prisma.club.findUnique({
    where: { slug: clubSlug },
    include: {
      teams: {
        include: {
          players: true,
          matches: {
            include: {
              locations: true,
              lineups: {
                include: {
                  player: true,
                },
              },
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
          <PlayersCard
            players={players}
            className="mb-8"
            clubSlug={clubSlug}
            teamSlug={teamSlug}
          />
          {matches && teamName && (
            <div className="flex flex-col gap-8 md:grid md:grid-cols-2 xl:grid-cols-3">
              {matches.map((match, id) => {
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
              <Link href={`./${teamSlug}/spiel/neu`}>
                <Card className="p-6 w-full aspect-square md:aspect-auto flex justify-center items-center gap-2">
                  <Add01Icon size={20} />
                  <Typography variant="p-gray">
                    Neues Spiel hinzufügen
                  </Typography>
                </Card>
                {!matches.length && (
                  <Typography variant="p-gray">
                    Keine Spiele gefunden
                  </Typography>
                )}
              </Link>
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
