"use client";
import { Match } from "@prisma/client";
import Typography from "../typography";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Copy01Icon,
  LeftToRightListNumberIcon,
  PencilEdit02Icon,
} from "hugeicons-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { MoreHorizontal } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface GameCardHeaderProps {
  match: Match;
}

const GameCardHeader: React.FC<GameCardHeaderProps> = ({ match }) => {
  const isLeader = true;
  const handleCopy = () => {
    toast({
      title: "Infotext kopiert",
      description: (
        <div className="mt-2 w-[340px] flex gap-2">
          <Typography variant="p" className="leading-1">
            Der Infotext wurde erfolgreich in die Zwischenablage kopiert.
          </Typography>
        </div>
      ),
    });
  };

  const PopoverOptions = [
    {
      name: "Infotext kopieren",
      IconComponent: Copy01Icon,
      handler: handleCopy,
    },
    { name: "Spieldaten anpassen", IconComponent: PencilEdit02Icon },
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
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon-lg">
                <MoreHorizontal />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-2">
              {PopoverOptions.map(({ name, IconComponent, handler }, id) => (
                <div key={id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-2"
                    onClick={handler}
                  >
                    <IconComponent />
                    <Typography variant="p">{name}</Typography>
                  </Button>
                </div>
              ))}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default GameCardHeader;
