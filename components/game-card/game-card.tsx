import React from "react";
import { Card } from "../ui/card";
import AvailabiltyButtons from "../game-avaliabilty-buttons";
import GameCardHeader from "./game-card-header";
import GameCardBody from "./game-card-body";
import {
  AvailabilityVoteWithPlayer,
  MatchWithLineupAndLocation,
} from "@/types/prismaTypes";
import { Player } from "@prisma/client";
import GameAvailabilityDialog from "../game-availability-dialog";

interface GameCardProps {
  match: MatchWithLineupAndLocation;
  isLineup: boolean;
  matchAvailabilityVotes: AvailabilityVoteWithPlayer[];
  teamSlug: string;
  players: Player[];
  clubSlug: string;
}

const GameCard: React.FC<GameCardProps> = async ({
  match,
  isLineup,
  players,
  matchAvailabilityVotes,
  teamSlug,
  clubSlug,
}) => {
  return (
    <Card>
      <GameCardHeader match={match} teamSlug={teamSlug} clubSlug={clubSlug} />
      <GameCardBody match={match} teamSlug={teamSlug} />
      {!isLineup && (
        <div className="p-6 pt-0 space-y-2">
          <AvailabiltyButtons
            matchId={match.id}
            matchAvailabilityVotes={matchAvailabilityVotes}
            teamSlug={teamSlug}
            clubSlug={clubSlug}
            allPlayers={players}
          />
          <GameAvailabilityDialog
            matchAvailabilityVotes={matchAvailabilityVotes}
            allPlayers={players}
          />
        </div>
      )}
    </Card>
  );
};

export default GameCard;
