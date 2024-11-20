import React from "react";
import { Card } from "../ui/card";
import AvailabiltyButtons from "../game-avaliabilty-buttons";
import GameCardHeader from "./game-card-header";
import GameCardBody from "./game-card-body";
import { MatchWithLineupAndLocation } from "@/types/prismaTypes";

interface GameCardProps {
  match: MatchWithLineupAndLocation;
  isLineup: boolean;
  teamName: string;
}

const GameCard: React.FC<GameCardProps> = async ({
  match,
  isLineup,
  teamName,
}) => {
  return (
    <Card className="p-6 space-y-6">
      <GameCardHeader match={match} />
      <GameCardBody match={match} />
      {!isLineup && <AvailabiltyButtons teamName={teamName} />}
    </Card>
  );
};

export default GameCard;
