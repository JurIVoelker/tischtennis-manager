import { Player, Prisma } from "@prisma/client";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface PlayersCardProps {
  players: Player[] | undefined; // TODO TYPE
}

const PlayersCard = ({ players }: PlayersCardProps) => {
  return (
    <Card className="p-6 ">
      <h2 className="mb-4">Spieler</h2>
      <div className="flex flex-wrap gap-2">
        {!players && <p>Keine Spieler gefunden</p>}
        {players &&
          players.map((player) => (
            <Badge variant="secondary">{`${player.firstName}`}</Badge>
          ))}
      </div>
    </Card>
  );
};

export default PlayersCard;
