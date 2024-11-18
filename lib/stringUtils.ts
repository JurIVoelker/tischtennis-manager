import { Match } from "@prisma/client";
import { getDateAndTime } from "./dateUtils";

export const getInfoTextString = (match: Match) => {
  const { dateString, timeString } = getDateAndTime(match.matchDateTime);
  return `Am Freitag, den ${dateString} um ${timeString} Uhr findet das Spiel gegen ${
    match.enemyClubName
  } statt. Wir spielen mit folgender Aufstellung: ${match.lineup
    .map((lineup) => lineup.player.firstName)
    .join("\n - ")}`;
};
