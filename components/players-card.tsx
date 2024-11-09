import { Prisma } from "@prisma/client";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface PlayersCardProps {
  players: any; // TODO TYPE
}

const PlayersCard = ({ players }: PlayersCardProps) => {
  return (
    <Card className="p-6 flex flex-wrap gap-1">
      {players.map((player) => (
        <Badge variant="outline">{player.firstName}</Badge>
      ))}
    </Card>
  );
};

export default PlayersCard;
