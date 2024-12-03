import ConfigureLineupWrapper from "@/components/configure-lineup-wrapper";
import Navbar from "@/components/navbar";
import {
  decodeMatchPageParams,
  MatchPageParams,
  generateEditMatchParams as generateParamsWithMatchId,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { getOrderedPlayers } from "@/lib/prismaUtils";
import { notFound } from "next/navigation";

const ManageLineup = async ({
  params,
}: {
  params: Promise<MatchPageParams>;
}) => {
  const { matchId } = await decodeMatchPageParams(params);

  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      lineups: {
        orderBy: {
          position: "asc",
        },
        include: {
          player: true,
        },
      },
      team: {
        include: {
          club: true,
        },
      },
    },
  });

  const club = await prisma.club.findUnique({
    where: {
      id: match?.team.club.id || "",
    },
    include: {
      teams: {
        include: {
          players: true,
        },
      },
    },
  });

  const lineups = match?.lineups || [];

  const matchAvailablilityVotes = await prisma.matchAvailabilityVote.findMany({
    where: {
      matchId: matchId,
    },
  });

  const orderedPlayers = await getOrderedPlayers(match?.team.id || "");
  const disabledPlayerIds = orderedPlayers.map((player) => player.id);

  if (!match) {
    notFound();
  }

  return (
    <div className="w-full">
      <Navbar title="Aufstellung anpassen" />
      <div className="px-6 pb-6 pt-16 space-y-6">
        <ConfigureLineupWrapper
          defaultLineup={lineups}
          matchAvailablilityVotes={matchAvailablilityVotes}
          allTeams={club?.teams || []}
          teamName={match?.team.name || ""}
          mainPlayers={orderedPlayers}
          disabledPlayerIds={disabledPlayerIds}
        />
      </div>
    </div>
  );
};

export default ManageLineup;

export async function generateStaticParams() {
  return await generateParamsWithMatchId();
}