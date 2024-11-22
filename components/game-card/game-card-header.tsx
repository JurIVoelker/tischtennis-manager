"use client";
import Typography from "../typography";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Copy01Icon,
  LeftToRightListNumberIcon,
  PencilEdit02Icon,
} from "hugeicons-react";
import { MoreHorizontal } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getInfoTextString } from "@/lib/stringUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MatchWithLineupAndLocation } from "@/types/prismaTypes";
import { useRouter } from "next/navigation";

interface GameCardHeaderProps {
  match: MatchWithLineupAndLocation;
  teamSlug: string;
}

const GameCardHeader: React.FC<GameCardHeaderProps> = ({ match, teamSlug }) => {
  const { push } = useRouter();
  const isLeader = true;
  const handleCopy = () => {
    const text = getInfoTextString(match);
    if (!text) {
      toast({
        title: "Fehler beim Kopieren",
        description: (
          <div className="mt-2 w-[340px] flex gap-2">
            <Typography variant="p" className="leading-1">
              Beim kopieren des Infotextes ist ein Fehler aufgetreten.
            </Typography>
          </div>
        ),
      });
      return;
    }
    navigator.clipboard.writeText(text);
    toast({
      title: "Infotext kopiert",
      description: (
        <div className="mt-2 w-[340px] flex gap-2">
          <Typography variant="p" className="leading-1">
            {"Der Infotext für das Spiel gegen "}
            <strong>{match.enemyClubName}</strong> wurde erfolgreich in die
            Zwischenablage kopiert.
          </Typography>
        </div>
      ),
    });
  };

  const handleEdit = () => {
    push(`./${teamSlug}/spiel/anpassen/${match.id}`);
  };

  const dropdownOptions = [
    {
      name: "Infotext kopieren",
      IconComponent: Copy01Icon,
      handler: handleCopy,
    },
    {
      name: "Spieldaten anpassen",
      IconComponent: PencilEdit02Icon,
      handler: handleEdit,
    },
    {
      name: "Aufstellungen verwalten",
      IconComponent: LeftToRightListNumberIcon,
    },
  ];

  return (
    <div className="flex justify-between mb-6 gap-4 h-10 items-center">
      <Typography variant="h4">{match.enemyClubName}</Typography>
      <div className="inline-flex gap-2 flex-wrap items-center">
        <Badge variant="secondary" className="h-fit">
          {match.isHomeGame ? "Heim" : "Auswährts"}
        </Badge>
        {isLeader && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon-lg">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-2">
              {dropdownOptions.map(({ name, IconComponent, handler }, id) => (
                <DropdownMenuItem
                  key={id}
                  onSelect={handler}
                  className="flex items-center gap-2 p-2"
                  disabled={!handler || !match.lineups.length}
                >
                  <IconComponent />
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default GameCardHeader;
