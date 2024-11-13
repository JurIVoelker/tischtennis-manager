import { Player } from "@prisma/client";
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
        {!players?.length && (
          <Typography variant="p-gray">Keine Spieler gefunden</Typography>
        )}
        {players &&
          players.map((player) => (
            <Badge
              variant="secondary"
              key={player.id}
            >{`${player.firstName}`}</Badge>
          ))}
      </div>
    </Card>
  );
};

export default PlayersCard;
