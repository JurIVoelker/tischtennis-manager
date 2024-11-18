import ManagePlayersHeader from "@/components/manage-players/manage-players-header";
import Navbar from "@/components/navbar";

const ManagePlayersPage = () => {
  return (
    <div className="w-full">
      <Navbar title="Spieler verwalten" />
      <div className="px-6 pb-6 pt-16 ">
        <ManagePlayersHeader />
      </div>
    </div>
  );
};

export default ManagePlayersPage;
