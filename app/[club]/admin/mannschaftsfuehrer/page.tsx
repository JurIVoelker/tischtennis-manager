import Navbar from "@/components/navbar";
import TeamLeadersCollapsible from "@/components/team-leaders-collapsible";
import {
  ClubParams,
  decodeClubParams,
  generateClubParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";

const AdminLeaderPage = async ({ params }: { params: Promise<ClubParams> }) => {
  const { clubSlug } = await decodeClubParams(params);

  const teams = await prisma.team.findMany({
    where: {
      club: {
        slug: clubSlug,
      },
    },
    include: {
      teamLeader: true,
      teamLeaderInvite: {
        select: {
          id: true,
          expiresAt: true,
          email: true,
          fullName: true,
        },
      },
    },
  });

  return (
    <div className="w-full">
      <Navbar title="Mannschaftsführer" />
      <div className="space-y-12 px-6 pb-6 pt-16">
        <div className="space-y-3">
          {teams.map((team) => (
            <TeamLeadersCollapsible
              team={team}
              key={team.id}
              clubSlug={clubSlug}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminLeaderPage;

export async function generateStaticParams() {
  return await generateClubParams();
}
