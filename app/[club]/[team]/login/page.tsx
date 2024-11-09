import { prisma } from "@/lib/prisma/prisma";
import slugify from "slugify";

const ClubUserLoginPage = async ({
  params,
}: {
  params: Promise<{ club: string }>;
}) => {
  const clubSlug = decodeURIComponent((await params).club);
  const club = await prisma.club.findUnique({
    where: { slug: clubSlug },
    include: {
      teams: {
        include: { players: true },
      },
    },
  });

  const teams = club?.teams || [];

  return (
    <div>
      <p>{club?.name}</p>
      {teams.map((team) => (
        <div>
          <p>{team.name}</p>
          {team.players.map((player) => (
            <p>{player.firstName}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ClubUserLoginPage;

export async function generateStaticParams() {
  const clubs = await prisma.club.findMany({
    include: {
      teams: true,
    },
  });

  const paths: { club: String; team: String }[] = [];

  clubs.forEach((club) => {
    club.teams.forEach((team) => {
      paths.push({
        club: slugify(club.slug),
        team: slugify(team.slug),
      });
    });
  });

  return paths;
}
