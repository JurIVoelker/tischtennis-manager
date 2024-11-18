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

interface GameCardHeaderProps {
  match: Match;
}

const PopoverOptions = [
  { name: "Infotext kopieren", IconComponent: Copy01Icon },
  { name: "Spieldaten anpassen", IconComponent: PencilEdit02Icon },
  { name: "Aufstellungen verwalten", IconComponent: LeftToRightListNumberIcon },
];

const GameCardHeader: React.FC<GameCardHeaderProps> = ({ match }) => {
  const isLeader = true;
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
              {PopoverOptions.map(({ name, IconComponent }, id) => (
                <div key={id}>
                  <Button variant="ghost" className="w-full justify-start p-2">
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
