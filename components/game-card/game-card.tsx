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
  teamSlug: string;
}

const GameCard: React.FC<GameCardProps> = async ({
  match,
  isLineup,
  teamName,
  teamSlug,
}) => {
  return (
    <Card className="p-6 space-y-6">
      <GameCardHeader match={match} teamSlug={teamSlug} />
      <GameCardBody match={match} teamSlug={teamSlug} />
      {!isLineup && <AvailabiltyButtons teamName={teamName} />}
    </Card>
  );
};

export default GameCard;
