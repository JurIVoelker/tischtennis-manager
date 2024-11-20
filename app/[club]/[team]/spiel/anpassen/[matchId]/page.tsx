export const dynamicParams = false;
import Navbar from "@/components/navbar";
import {
  decodeEditMatchParams,
  EditMatchParams,
  generateEditMatchParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";

const ClubTeamPage = async ({
  params,
}: {
  params: Promise<EditMatchParams>;
}) => {
  const { matchId } = await decodeEditMatchParams(params);

  const match = await prisma.match.findUnique({
    where: {
      id: matchId,
    },
  });

  return (
    <>
      <div className="w-full">
        <Navbar title={"Spiel bearbeiten"} />
        <div className="px-6 pb-6 pt-16 ">{JSON.stringify(match)}</div>
      </div>
    </>
  );
};

export default ClubTeamPage;

export async function generateStaticParams() {
  return await generateEditMatchParams();
}
