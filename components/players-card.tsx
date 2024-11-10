import { Player, Prisma } from "@prisma/client";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import Typography from "./typography";

interface PlayersCardProps {
  players: Player[] | undefined;
}

const PlayersCard = ({ players }: PlayersCardProps) => {
  return (
    <Card className="p-6 ">
      <Typography className="mb-4" variant="h4">
        Spieler
      </Typography>
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
