import EditMatchForm from "@/components/edit-match/edit-match-form";
import Headline from "@/components/headline";
import Navbar from "@/components/navbar";
import Typography from "@/components/typography";
import {
  decodeMatchPageParams,
  MatchPageParams,
  generateEditMatchParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { MatchWithLocation } from "@/types/prismaTypes";
import { notFound } from "next/navigation";

export const revalidate = 600;

const EditMatchPage = async ({
  params,
}: {
  params: Promise<MatchPageParams>;
}) => {
  const { matchId, teamSlug, clubSlug } = await decodeMatchPageParams(params);

  const match: MatchWithLocation = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      location: true,
    },
  });

  if (!match) {
    notFound();
  }

  return (
    <>
      <div className="w-full">
        <Navbar />
        <div className="px-6 pt-16 space-y-6 pb-20">
          <Headline>Spiel bearbeiten</Headline>
          <Typography variant="h3">{match?.enemyClubName}</Typography>
          <EditMatchForm
            match={match}
            teamSlug={teamSlug}
            clubSlug={clubSlug}
          />
        </div>
      </div>
    </>
  );
};

export default EditMatchPage;

export async function generateStaticParams() {
  return await generateEditMatchParams();
}
