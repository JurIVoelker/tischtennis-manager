export const dynamicParams = false;
import EditMatchDateTime from "@/components/edit-match/edit-match-date-time";
import EditMatchLocation from "@/components/edit-match/edit-match-location";
import Navbar from "@/components/navbar";
import Typography from "@/components/typography";
import {
  decodeEditMatchParams,
  EditMatchParams,
  generateEditMatchParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";

const EditMatchPage = async ({
  params,
}: {
  params: Promise<EditMatchParams>;
}) => {
  const { matchId } = await decodeEditMatchParams(params);

  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
    include: {
      locations: true,
    },
  });

  return (
    <>
      <div className="w-full">
        <Navbar title={"Spiel bearbeiten"} />
        <div className="px-6 pb-6 pt-16 space-y-6">
          <Typography variant="h3">{match?.enemyClubName}</Typography>
          <EditMatchDateTime />
          <EditMatchLocation />
        </div>
      </div>
    </>
  );
};

export default EditMatchPage;

export async function generateStaticParams() {
  return await generateEditMatchParams();
}
