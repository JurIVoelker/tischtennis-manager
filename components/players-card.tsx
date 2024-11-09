import { Prisma } from "@prisma/client";
import { Card } from "./ui/card";

interface PlayersCardProps {
  players: any; // TODO TYPE
}

const PlayersCard = ({ players }: PlayersCardProps) => {
  return <Card className="p-6">{JSON.stringify(players)}</Card>;
};

export default PlayersCard;
