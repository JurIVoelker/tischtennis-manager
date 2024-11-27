"use client";
import Link from "next/link";
import { Card } from "../ui/card";
import { Add01Icon } from "hugeicons-react";
import Typography from "../typography";
import { useIsPermitted } from "@/hooks/use-has-permission";

interface NewGameProps {
  teamSlug: string;
}

const NewGame: React.FC<NewGameProps> = ({ teamSlug }) => {
  const isVisible = useIsPermitted("view:add-new-game");

  if (!isVisible) return <></>;
  return (
    <Link
      href={`./${teamSlug}/spiel/neu`}
      className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card className="p-6 w-full flex justify-center items-center gap-2 min-h-48 h-full">
        <Add01Icon size={20} className="flex-shrink-0" />
        <Typography variant="p-gray">Neues Spiel hinzufügen</Typography>
      </Card>
    </Link>
  );
};

export default NewGame;
