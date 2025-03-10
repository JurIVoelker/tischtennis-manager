import Headline from "@/components/headline";
import Navbar from "@/components/navbar";
import Typography from "@/components/typography";
import UserLoginForm from "@/components/user-login-form";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { getOrderedPlayers } from "@/lib/prismaUtils";

const ClubUserLoginPage = async ({
  params,
}: {
  params: Promise<ClubTeamParams>;
}) => {
  const { clubSlug, teamSlug } = await decodeClubTeamParams(params);

  const club = await prisma.club.findUnique({
    where: { slug: clubSlug },
    include: {
      teams: {
        where: { slug: teamSlug },
      },
    },
  });
  const teamId = club?.teams[0]?.id;
  const players = await getOrderedPlayers(teamId);

  const teamName = club?.teams[0]?.name;

  return (
    <div className="w-full">
      <Navbar menuHidden />
      <div className="space-y-12 px-6 pb-6 pt-16">
        <Headline>Login</Headline>
        {teamName && Boolean(players?.length) && (
          <>
            <div className="space-y-2">
              <Typography variant="h3">{teamName}</Typography>
              <Typography variant="p-gray">{`Du wurdest eingeladen ${teamName} beizutreten. Wähle deinen Namen aus um fortzufahren.`}</Typography>
            </div>
            <UserLoginForm
              players={players}
              teamName={teamName}
              clubSlug={clubSlug}
              teamSlug={teamSlug}
            />
          </>
        )}
        {/* Error handling */}
        {players?.length === 0 ? (
          <div className="space-y-2">
            <Typography variant="h3">Keine Spieler gefunden</Typography>
            <Typography variant="p-gray">
              Es scheint so als ob es keine Spieler in dieser Mannschaft gibt.
              Bitte kontaktiere deinen Mannschaftsführer.
            </Typography>
          </div>
        ) : !teamName ? (
          <div className="space-y-2">
            <Typography variant="h3">Ungültiger Link</Typography>
            <Typography variant="p-gray">
              Es scheint so als ob dieser Link nicht gültig ist. Bitte
              kontaktiere deinen Mannschaftsführer.
            </Typography>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ClubUserLoginPage;

export async function generateStaticParams() {
  return await generateTeamPageParams();
}
