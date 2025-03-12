import Headline from "@/components/headline";
import Navbar from "@/components/navbar";
import { AddTeamModal } from "@/components/popups/add-team-modal";
import TeamLeadersCollapsible from "@/components/team-leaders-collapsible";
import {
  ClubParams,
  decodeClubParams,
  generateClubParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";

export const revalidate = 600;

const AdminLeaderPage = async ({ params }: { params: Promise<ClubParams> }) => {
  const { clubSlug } = await decodeClubParams(params);

  const teams = (
    await prisma.team.findMany({
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
    })
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full">
      <Navbar />
      <div className="space-y-12 px-6 pb-6 pt-16">
        <Headline>Mannschaftsführer</Headline>
        <div className="space-y-6">
          {teams.map((team) => (
            <TeamLeadersCollapsible
              team={team}
              key={team.id}
              clubSlug={clubSlug}
            />
          ))}
          <AddTeamModal clubSlug={clubSlug} />
        </div>
      </div>
    </div>
  );
};

export default AdminLeaderPage;

export async function generateStaticParams() {
  return await generateClubParams();
}
