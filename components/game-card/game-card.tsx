import { Location, Match } from "@prisma/client";
import React from "react";
import { Card } from "../ui/card";
import AvailabiltyButtons from "../game-avaliabilty-buttons";
import GameCardHeader from "./game-card-header";
import GameCardBody from "./game-card-body";

interface GameCardProps {
  match: Match;
  location: Location;
  isLineup: boolean;
  teamName: string;
}

const GameCard: React.FC<GameCardProps> = async ({
  match,
  location,
  isLineup,
  teamName,
}) => {
  return (
    <Card className="p-6 space-y-6">
      <GameCardHeader match={match} />
      <GameCardBody match={match} location={location} />
      {!isLineup && <AvailabiltyButtons teamName={teamName} />}
    </Card>
  );
};

export default GameCard;
