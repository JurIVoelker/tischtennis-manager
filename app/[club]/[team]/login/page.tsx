import Navbar from "@/components/navbar";
import Typography from "@/components/typography";
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
  const teamName = club?.teams[0].name;

  return (
    <div className="w-full">
      <Navbar title="Login" />
      <div className="space-y-12 px-6 pb-6 pt-16">
        <div>
          <Typography variant="h3">{teamName}</Typography>
          <Typography
            variant="p-gray"
            className="mt-2"
          >{`Du wurdest eingeladen ${teamName} beizutreten. Wähle deinen Namen aus um fortzufahren.`}</Typography>
        </div>

        <UserLoginForm players={players} />
      </div>
    </div>
  );
};

export default ClubUserLoginPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
