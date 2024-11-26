import { Calendar02Icon, Location01Icon } from "hugeicons-react";
import Typography from "../typography";
import Lineup from "../lineup";
import { getDateAndTime } from "@/lib/dateUtils";
import { MatchWithLineupAndLocation } from "@/types/prismaTypes";

interface GameCardBodyProps {
  match: MatchWithLineupAndLocation;
}

const GameCardBody: React.FC<GameCardBodyProps> = ({ match }) => {
  const { dateString, timeString } = getDateAndTime(match.matchDateTime);
  const dateTimeString = `${dateString} um ${timeString} Uhr`;

  const { hallName, streetAddress, city } = match?.location || {};
  const locationString = `${hallName}, ${streetAddress}, ${city}`;

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
