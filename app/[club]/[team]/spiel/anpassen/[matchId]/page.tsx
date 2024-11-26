export const dynamicParams = false;
import EditMatchForm from "@/components/edit-match/edit-match-form";
import Navbar from "@/components/navbar";
import Typography from "@/components/typography";
import {
  decodeEditMatchParams,
  EditMatchParams,
  generateEditMatchParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { MatchWithLocation } from "@/types/prismaTypes";
import { notFound } from "next/navigation";

const EditMatchPage = async ({
  params,
}: {
  params: Promise<EditMatchParams>;
}) => {
  const { matchId } = await decodeEditMatchParams(params);

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
        <Navbar title={"Spiel bearbeiten"} />
        <div className="px-6 pb-6 pt-16 space-y-6">
          <Typography variant="h3">{match?.enemyClubName}</Typography>
          <EditMatchForm match={match} />
        </div>
      </div>
    </>
  );
};

export default EditMatchPage;

export async function generateStaticParams() {
  return await generateEditMatchParams();
}
