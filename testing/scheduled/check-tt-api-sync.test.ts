import { prisma } from "@/lib/prisma/prisma";
import { TTApiMatch, TTApiMatchesReturnType } from "@/scripts/mytt/importGames";
import "dotenv/config";

const { DISCORD_WEBHOOK_URL, TT_API_KEY } = process.env;

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
  let fetchedMatches;
  try {
    const request = await fetch(
      "https://tt-api.ttc-klingenmuenster.de/api/v1/matches",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: TT_API_KEY || "",
        },
      }
    );

    if (!request.ok) {
      console.error("Failed to fetch matches from TT API");
      return;
    }

    fetchedMatches = (await request.json()) as TTApiMatchesReturnType;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch matches from TT API");
  }

  const missingMatches = [];
  const unequalTimeMatches = [];
  const unequalHomeGameMatches = [];
  const unequalLocationMatches = [];

  for (const fetchedMatch of fetchedMatches.matches) {
    const match = await prisma.match.findFirst({
      where: {
        id: fetchedMatch.id,
      },
      include: {
        location: true,
      },
    });

    if (!match) {
      missingMatches.push(fetchedMatch);
      continue;
    }

    if (
      new Date(match.matchDateTime).getTime() !==
      new Date(fetchedMatch.datetime).getTime()
    ) {
      unequalTimeMatches.push(fetchedMatch);
    }

    if (match.isHomeGame !== fetchedMatch.isHomeGame) {
      unequalHomeGameMatches.push(fetchedMatch);
    }

    const { city, street, zip } = fetchedMatch.location.address;

    if (
      match.location?.city !== city + " " + zip ||
      match.location?.streetAddress !== street ||
      match.location?.hallName !== fetchedMatch.location.name
    ) {
      unequalLocationMatches.push(fetchedMatch);
    }
  }
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
