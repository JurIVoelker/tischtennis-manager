import { prisma } from "@/lib/prisma/prisma";
import {
  categorizeMatchInconsistencies,
  getTTApiMatches,
} from "@/lib/syncUtils";
import { TTApiMatch } from "@/scripts/mytt/importGames";
import "dotenv/config";

const { DISCORD_WEBHOOK_URL } = process.env;

const timeMapper = (m: TTApiMatch) => {
  const round = m.id.split("_")[1];
  const league = m.league.nickname;
  const ownTeam = m.isHomeGame ? m.teams.home.name : m.teams.away.name;
  const opponentTeam = m.isHomeGame ? m.teams.away.name : m.teams.home.name;
  return `- [${round.toUpperCase()} - ${league}] ${ownTeam} vs ${opponentTeam} at ${new Date(m.datetime).toLocaleString()}`;
};

const getMessageString = (
  label: string,
  matches: TTApiMatch[],
  mapper: (m: TTApiMatch) => string = (m: TTApiMatch) => {
    const round = m.id.split("_")[1];
    const league = m.league.nickname;
    const ownTeam = m.isHomeGame ? m.teams.home.name : m.teams.away.name;
    const opponentTeam = m.isHomeGame ? m.teams.away.name : m.teams.home.name;
    return `- [${round.toUpperCase()} - ${league}] ${ownTeam} vs ${opponentTeam}`;
  }
) => {
  const suffix = matches.length > 10 ? "\n..." : "";
  return `\n### ${label} (${matches.length}) \n${matches
    .splice(0, 10)
    .map(mapper)
    .join("\n")}${suffix}`;
};

export const checkTTApiSync = async () => {
  const fetchedMatches = await getTTApiMatches();
  const ignoredIds = (await prisma.hiddenMatch.findMany()).map(
    (match) => match.id
  );
  const filteredMatches = fetchedMatches.matches.filter(
    (match) => !ignoredIds.includes(match.id)
  );

  const {
    missingMatches,
    unequalTimeMatches,
    unequalHomeGameMatches,
    unequalLocationMatches,
  } = await categorizeMatchInconsistencies(filteredMatches);

  const defaultMessage = `## Sync report ${new Date().toLocaleDateString()}:`;
  let message = defaultMessage;

  if (missingMatches.length > 0) {
    message += getMessageString(`Missing Matches`, missingMatches);
  }

  if (unequalTimeMatches.length > 0) {
    message += getMessageString(
      `Unequal Time Matches`,
      unequalTimeMatches,
      timeMapper
    );
  }

  if (unequalHomeGameMatches.length > 0) {
    message += getMessageString(
      `Unequal Home Game Matches`,
      unequalHomeGameMatches
    );
  }

  if (unequalLocationMatches.length > 0) {
    message += getMessageString(
      `Unequal Location Matches`,
      unequalLocationMatches
    );
  }

  if (message !== defaultMessage) {
    await fetch(DISCORD_WEBHOOK_URL || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message.substring(0, 1900),
      }),
    });
  } else {
    await fetch(DISCORD_WEBHOOK_URL || "", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `## Check successful: All matches are in sync`,
      }),
    });
  }
};

(async () => {
  await checkTTApiSync();
})();
