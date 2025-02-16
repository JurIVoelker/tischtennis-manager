import IndexLoginManager from "@/components/index-login-manager";
import Navbar from "@/components/navbar";
import Typography from "@/components/typography";
import { Separator } from "@/components/ui/separator";

const IndexPage = () => {
  return (
    <div className="w-full">
      <Navbar title="Mannschaftsführer" />
      <div className="px-6 pb-6 pt-16">
        <Typography variant="h3" className="mb-2">
          Tischtennis Manager
        </Typography>
        <Typography variant="p">
          Willkommen beim TT-Manager. Um einer Mannschaft beizutreten, musst du
          den Einladungslink, den du von deinem Mannschaftsführer bekommen hast
          öffnen.
        </Typography>
        <Separator className="my-8" />
        <Typography variant="h3" className="mb-2">
          Login für Mannschaftsführer
        </Typography>
        <Typography variant="p">
          Falls du Mannschaftsführer bist, kannst du dich hier anmelden, um
          deiner Mannschaft beizutreten.
        </Typography>
        <IndexLoginManager />
      </div>
    </div>
  );
};

export default IndexPage;
