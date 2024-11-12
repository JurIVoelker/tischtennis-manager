import Navbar from "@/components/navbar";
import UserLoginForm from "@/components/user-login-form";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";

const ClubUserLoginPage = async ({
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
        },
      },
    },
  });

  const players = club?.teams[0].players;

  return (
    <>
      <Navbar title="Login" />
      <div className="flex flex-col gap-8 px-6 pb-6 pt-16">
        <UserLoginForm players={players} />
      </div>
    </>
  );
};

export default ClubUserLoginPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
