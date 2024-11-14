import { Location, Match } from "@prisma/client";
import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import AvailabiltyButtons from "./game-avaliabilty-buttons";
import Typography from "./typography";
import Lineup from "./lineup";
import {
  Calendar01Icon,
  Calendar02Icon,
  Location01Icon,
} from "hugeicons-react";

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
  const { matchDateTime: dateTime } = match;
  const dateString = `${dateTime.getDay()}.${dateTime.getMonth()}.${dateTime.getFullYear()}`;
  const timeString = `${dateTime.getHours()}:${dateTime.getMinutes()}`;
  const dateTimeString = `${dateString} um ${timeString} Uhr`;

  const { hallName, streetAddress, city, postalCode } = location;
  const locationString = `${hallName}, ${streetAddress} ${postalCode}, ${city}`;

  return (
    <Card className="p-6 space-y-6">
      {/* Game Card Header */}
      <div className="flex justify-between mb-6">
        <Typography variant="h4">{match.enemyClubName}</Typography>
        <Badge variant="secondary">
          {match.isHomeGame ? "Heim" : "Auswährts"}
        </Badge>
      </div>
      {/* Game Card Body */}
      <div>
        <div className="inline-flex items-center gap-1 mb-2">
          <Calendar02Icon size={20} stroke="4" className="shrink-0" />
          <Typography variant="p-gray" className="leading-0">
            {dateTimeString}
          </Typography>
        </div>
        <div className="inline-flex items-center gap-1">
          <Location01Icon size={20} stroke="4" className="shrink-0" />
          <Typography variant="p-gray" className="leading-0">
            {locationString}
          </Typography>
        </div>
        <Typography variant="h5" className="mt-6">
          Aufstellung
        </Typography>
        <Lineup matchId={match.id} />
      </div>
      {/* Footer */}
      {!isLineup && <AvailabiltyButtons teamName={teamName} />}
    </Card>
  );
};

export default GameCard;
