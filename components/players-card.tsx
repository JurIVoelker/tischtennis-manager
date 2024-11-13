import { Player, Prisma } from "@prisma/client";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import Typography from "./typography";
import { cn } from "@/lib/utils";

interface PlayersCardProps {
  players: Player[] | undefined;
  className?: string;
}

const PlayersCard = ({ players, className }: PlayersCardProps) => {
  return (
    <Card className={cn("p-6", className)}>
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
