import { Lineup as LineupType, Location, Match } from "@prisma/client";
import React, { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import AvailabiltyButtons from "./game-avaliabilty-buttons";
import Typography from "./typography";
import Lineup from "./lineup";

interface GameCardProps {
  match: Match;
  location: Location;
  lineup: LineupType;
}

const GameCard: React.FC<GameCardProps> = ({ match, location, lineup }) => {
  const { matchDateTime: dateTime } = match;
  const dateString = `${dateTime.getDay()}.${dateTime.getMonth()}.${dateTime.getFullYear()}`;
  const timeString = `${dateTime.getHours()}:${dateTime.getMinutes()}`;
  const dateTimeString = `${dateString} um ${timeString} Uhr`;

  const { hallName, streetAddress, city, postalCode } = location;
  const locationString = `${hallName}, ${streetAddress} ${postalCode}, ${city}`;
  return (
    <Card className="p-6">
      {/* Game Card Header */}
      <div className="flex justify-between mb-6">
        <Typography variant="h4">{match.enemyClubName}</Typography>
        <Badge variant="secondary">
          {match.isHomeGame ? "Heim" : "Auswährts"}
        </Badge>
      </div>
      {/* Game Card Body */}
      <div className="py-4">
        <Typography variant="p-gray">{dateTimeString}</Typography>
        <Typography variant="p-gray" className="[&:not(:first-child)]:mt-0">
          {locationString}
        </Typography>
        <Typography variant="h5" className="mt-6">
          Aufstellung
        </Typography>
        <Lineup lineup={lineup} />
      </div>
      {/* Footer */}
      <Typography variant="h5" className="mb-2 mt-6">
        Hast du Zeit zu spielen?
      </Typography>
      <AvailabiltyButtons />
    </Card>
  );
};

export default GameCard;
