import { prisma } from "@/lib/prisma/prisma";
import {
  categorizeMatchInconsistencies,
  getTTApiMatches,
} from "@/lib/syncUtils";
import { TTApiMatch } from "@/scripts/mytt/importGames";
import "dotenv/config";

const { DISCORD_WEBHOOK_URL } = process.env;

let syncedMatches: string[] = [];

const syncedString = "(✅🔁)"

const timeMapper = (m: TTApiMatch) => {
  const round = m.id.split("_")[1];
  const league = m.league.nickname;
  const ownTeam = m.isHomeGame ? m.teams.home.name : m.teams.away.name;
  const opponentTeam = m.isHomeGame ? m.teams.away.name : m.teams.home.name;
  const isAutoSynced = syncedMatches.some((id) => id === m.id);

  return `- [${round.toUpperCase()} - ${league}] ${ownTeam} vs ${opponentTeam} at ${new Date(m.datetime).toLocaleString()} ${isAutoSynced ? syncedString : ""}`;
};


const getMessageString = (
  label: string,
  matches: TTApiMatch[],
  mapper: (m: TTApiMatch) => string = (m: TTApiMatch) => {
    const round = m.id.split("_")[1];
    const league = m.league.nickname;
    const ownTeam = m.isHomeGame ? m.teams.home.name : m.teams.away.name;
    const opponentTeam = m.isHomeGame ? m.teams.away.name : m.teams.home.name;
    const isAutoSynced = syncedMatches.some((id) => id === m.id);
    return `- [${round.toUpperCase()} - ${league}] ${ownTeam} vs ${opponentTeam} ${isAutoSynced ? syncedString : ""}`;
  }
) => {
  const suffix = matches.length > 10 ? "\n..." : "";
  return `\n### ${label} (${matches.length}) \n${matches
    .splice(0, 10)
    .map(mapper)
    .join("\n")}${suffix}`;
};

const syncMatchesWithExistingTeams = async (matches: TTApiMatch[]) => {
  const existingTeams = await prisma.team.findMany({});

  const matchesForSync = [];

  for (const match of matches) {
    if (existingTeams.some((team) => (team.name === match.teams.home.name))) {
      matchesForSync.push(match.id);
    }
  }

  await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/api/match/sync`, {
    method: "POST",
    headers: {
      Cookie: "server-token=" + process.env.SERVER_API_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ids: matchesForSync, clubSlug: process.env.CLUB_SLUG || "" })
  }
  )

  return matchesForSync;
}

const ttApiSync = async () => {
  syncedMatches = [];
  const settings = await prisma.settings.findFirst();

  const autoSyncEnabled = settings?.autoSync ?? false;

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

  if (autoSyncEnabled) {
    syncedMatches = await syncMatchesWithExistingTeams([...missingMatches, ...unequalTimeMatches, ...unequalHomeGameMatches, ...unequalLocationMatches]);
  }

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

  if (syncedMatches.length > 0) {
    message += `\n### Auto-synced ${syncedMatches.length} matches ${syncedString}`;
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
        content: `## Sync report ${new Date().toLocaleDateString()}: All synced! ✅`,
      }),
    });
  }
};

(async () => {
  await ttApiSync();
})();
