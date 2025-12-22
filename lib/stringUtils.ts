import { MatchWithLineupAndLocation } from "@/types/prismaTypes";
import { getDateAndTime } from "./dateUtils";
import { Player } from "@prisma/client";

export const getWeekdayName = (date: Date) => {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
  }).format(date);
};

export const getInfoTextString = (match: MatchWithLineupAndLocation) => {
  if (
    !match?.matchDateTime ||
    !match?.enemyClubName ||
    typeof match?.isHomeGame !== "boolean" ||
    !Array.isArray(match?.lineups)
  ) {
    return null;
  }

  const daysUntilMatch = Math.ceil(
    (match.matchDateTime.getTime() - new Date().getTime()) /
    (1000 * 60 * 60 * 24)
  );

  const { dateString, timeString } = getDateAndTime(match.matchDateTime);
  let textBeginning = "";
  if (daysUntilMatch > 7 || daysUntilMatch < 0) {
    textBeginning = `Am ${getWeekdayName(
      match.matchDateTime
    )}, dem ${dateString} um ${timeString}`;
  } else if (daysUntilMatch > 1) {
    textBeginning = `Am ${getWeekdayName(
      match.matchDateTime
    )} (${dateString}) um ${timeString}`;
  } else if (daysUntilMatch === 1) {
    textBeginning = `Morgen (${dateString}) um ${timeString}`;
  } else if (daysUntilMatch === 0) {
    textBeginning = `Heute um ${timeString}`;
  }

  const sortedMatch = {
    ...match,
    lineups: match.lineups.sort((a, b) => a.position - b.position),
  };

  return `${textBeginning} Uhr findet das ${match.isHomeGame ? "Heimspiel" : "Auswärtsspiel"
    } gegen ${match.enemyClubName
    } statt. Wir spielen mit folgender Aufstellung: \n${sortedMatch.lineups
      .map((lineup, index) => `  ${index + 1}. ${lineup?.player.firstName}`)
      .join("\n")}`;
};

export const getPlayerName = (player: Player) => {
  return `${player.firstName} ${player.lastName}`;
};
