import Typography from "@/components/typography";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const InvalidLeaderLoginPage = () => {
  return (
    <div className="w-full">
      <div className="px-6 pb-6 pt-16 ">
        <Typography variant="h3">Login Fehlgeschlagen</Typography>
        <Typography variant="p" className="leading-10 mt-4">
          Dein Login war nicht erfolgreich. Bitte versuche es erneut. Bei
          weiteren Problemen kontaktiere einen Administrator.
        </Typography>
        <Link
          href="./"
          className={cn(buttonVariants({ variant: "default" }), "mt-2")}
        >
          Zurück zum Login
        </Link>
      </div>
    </div>
  );
};

export default InvalidLeaderLoginPage;
