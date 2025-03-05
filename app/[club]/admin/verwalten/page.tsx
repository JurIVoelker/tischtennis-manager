import Navbar from "@/components/navbar";
import AddAdminModal from "@/components/popups/add-admin-modal";
import TeamLeaderCard from "@/components/team-leader-card";
import { Button } from "@/components/ui/button";
import {
  ClubParams,
  decodeClubParams,
  generateClubParams,
} from "@/lib/nextUtils";
import { prisma } from "@/lib/prisma/prisma";
import { PlusSignIcon } from "hugeicons-react";

const AdminManagePage = async ({ params }: { params: Promise<ClubParams> }) => {
  const { clubSlug } = await decodeClubParams(params);

  const admins = await prisma.owner.findMany({
    where: {
      club: {
        slug: clubSlug,
      },
    },
    select: {
      email: true,
      fullName: true,
      id: true,
    },
  });

  return (
    <div className="w-full">
      <Navbar title="Admins" />
      <div className="space-y-12 px-6 pb-6 pt-16">
        <div className="space-y-3">
          {admins.map((admin) => (
            <TeamLeaderCard
              variant={"joined"}
              name={admin.fullName}
              email={admin.email}
              key={admin.id}
              id={admin.id}
              isAdmin
              clubSlug={clubSlug}
            />
          ))}
          <AddAdminModal clubSlug={clubSlug}>
            <Button variant="outline" className="w-full">
              <PlusSignIcon strokeWidth={2}/>
              Hinzufügen
            </Button>
          </AddAdminModal>
        </div>
      </div>
    </div>
  );
};

export default AdminManagePage;

export async function generateStaticParams() {
  return await generateClubParams();
}
