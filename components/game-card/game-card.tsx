import React from "react";
import { Card } from "../ui/card";
import AvailabiltyButtons from "../game-avaliabilty-buttons";
import GameCardHeader from "./game-card-header";
import GameCardBody from "./game-card-body";
import {
  AvailabilityVoteWithPlayer,
  MatchWithLineupAndLocation,
} from "@/types/prismaTypes";

interface GameCardProps {
  match: MatchWithLineupAndLocation;
  isLineup: boolean;
  matchAvailabilityVotes: AvailabilityVoteWithPlayer[];
  teamSlug: string;
  clubSlug: string;
}

const GameCard: React.FC<GameCardProps> = async ({
  match,
  isLineup,
  matchAvailabilityVotes,
  teamSlug,
  clubSlug,
}) => {
  return (
    <Card className="p-6 space-y-6">
      <GameCardHeader match={match} teamSlug={teamSlug} clubSlug={clubSlug} />
      <GameCardBody match={match} teamSlug={teamSlug} />
      {!isLineup && (
        <AvailabiltyButtons
          matchId={match.id}
          matchAvailabilityVotes={matchAvailabilityVotes}
          teamSlug={teamSlug}
          clubSlug={clubSlug}
        />
      )}
    </Card>
  );
};

export default GameCard;
