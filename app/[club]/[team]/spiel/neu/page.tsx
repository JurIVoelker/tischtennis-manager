import EditMatchForm from "@/components/edit-match/edit-match-form";
import Navbar from "@/components/navbar";
import {
  ClubTeamParams,
  decodeClubTeamParams,
  generateTeamPageParams,
} from "@/lib/nextUtils";

const CreateNewGame = async ({
  params,
}: {
  params: Promise<ClubTeamParams>;
}) => {
  const { clubSlug, teamSlug } = await decodeClubTeamParams(params);
  return (
    <div className="w-full">
      <Navbar title="Neues Spiel" />
      <div className="px-6 pb-6 pt-16 ">
        <EditMatchForm
          isCreate
          clubSlug={clubSlug}
          teamSlug={teamSlug}
          returnPath="../"
        />
      </div>
    </div>
  );
};

export async function generateStaticParams() {
  return await generateTeamPageParams();
}

export default CreateNewGame;
