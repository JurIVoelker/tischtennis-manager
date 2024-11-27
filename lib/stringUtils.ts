import { MatchWithLineupAndLocation } from "@/types/prismaTypes";
import { getDateAndTime } from "./dateUtils";
import { Player } from "@prisma/client";

export const getInfoTextString = (match: MatchWithLineupAndLocation) => {
  if (
    !match.matchDateTime ||
    !match.enemyClubName ||
    !Array.isArray(match.lineups)
  ) {
    return null;
  }

  const { dateString, timeString } = getDateAndTime(match.matchDateTime);
  return `Am Freitag, den ${dateString} um ${timeString} Uhr findet das Spiel gegen ${
    match.enemyClubName
  } statt. Wir spielen mit folgender Aufstellung: \n${match?.lineups
    .map((lineup, index) => `  ${index + 1}. ${lineup?.player.firstName}`)
    .join("\n")}`;
};

export const getPlayerName = (player: Player) => {
  return `${player.firstName} ${player.lastName}`;
};
