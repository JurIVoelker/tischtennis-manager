import EditMatchForm from "@/components/edit-match/edit-match-form";
import Navbar from "@/components/navbar";

const CreateNewGame = () => {
  return (
    <div className="w-full">
      <Navbar title="Neues Spiel" />
      <div className="px-6 pb-6 pt-16 ">
        <EditMatchForm isCreate />
      </div>
    </div>
  );
};

export default CreateNewGame;
