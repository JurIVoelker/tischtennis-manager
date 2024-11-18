import { Calendar02Icon, Location01Icon } from "hugeicons-react";
import Typography from "../typography";
import Lineup from "../lineup";
import { Location, Match } from "@prisma/client";
import { getDateAndTime } from "@/lib/dateUtils";

interface GameCardBodyProps {
  match: Match;
  location: Location;
}

const GameCardBody: React.FC<GameCardBodyProps> = ({ match, location }) => {
  const { dateString, timeString } = getDateAndTime(match.matchDateTime);
  const dateTimeString = `${dateString} um ${timeString} Uhr`;

  const { hallName, streetAddress, city, postalCode } = location;
  const locationString = `${hallName}, ${streetAddress} ${postalCode}, ${city}`;

  return (
    <div>
      <div className="inline-flex items-center gap-2 mb-2">
        <Calendar02Icon size={20} stroke="4" className="shrink-0" />
        <Typography variant="p-gray" className="leading-0">
          {dateTimeString}
        </Typography>
      </div>
      <div className="inline-flex items-center gap-2">
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
  );
};

export default GameCardBody;
