import { prisma } from "@/lib/prisma/prisma";
import { MatchType } from "@prisma/client";
import slugify from "slugify";

const { TT_API_KEY } = process.env;

if (!TT_API_KEY) {
  throw new Error("Missing TT_API_KEY");
}

export type TTApiMatchesReturnType = {
  matches: {
    isDuplicate?: boolean;
    id: string;
    datetime: string;
    location: {
      id: string;
      name: string;
      address: {
        street: string;
        zip: string;
        city: string;
      };
      link: string;
    };
    league: {
      name: string;
      nickname: string;
      teamType: string;
    };
    teams: {
      home: {
        name: string;
        index: string;
        club: string;
      };
      away: {
        name: string;
        index: string;
        club: string;
      };
    };
    result: {
      homeScore: number;
      awayScore: number;
      winner: "home" | "away" | "draw";
    } | null;
    isHomeGame: boolean;
  }[];
  meta: {
    expiresAt: string;
  };
};

export type TTApiMatch = TTApiMatchesReturnType["matches"][number];

export async function processMatches(matches: TTApiMatch[]) {
  const clubId =
    (
      await prisma.club.findFirst({
        select: {
          id: true,
        },
      })
    )?.id || "";

  if (!clubId) {
    throw new Error("No club found in the database");
  }

  for (const match of matches) {
    const { street, city, zip } = match.location.address;

    const condition = match.isDuplicate ? !match.isHomeGame : match.isHomeGame;

    const teamName = condition ? match.teams.home.name : match.teams.away.name;

    const enemyName = condition ? match.teams.away.name : match.teams.home.name;

    const teamId =
      (
        await prisma.team.findFirst({
          where: {
            name: teamName,
          },
          select: {
            id: true,
          },
        })
      )?.id || "";

    const matchType: MatchType = match.league.name.toLowerCase().includes("pokal") ? "cup" : "regular";

    const matchData = {
      id: match.id,
      enemyClubName: enemyName,
      isHomeGame: match.isHomeGame,
      matchDateTime: new Date(match.datetime),
      type: matchType,
      location: {
        create: {
          city: city + " " + zip,
          hallName: match.location.name,
          streetAddress: street,
        },
      },
      team: {
        connectOrCreate: {
          where: {
            id: teamId,
          },
          create: {
            name: teamName,
            slug: slugify(teamName),
            clubId,
            teamAuth: {
              create: {
                token:
                  Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(36).substring(2, 15),
              },
            },
          },
        },
      },
    };

    await prisma.match.upsert({
      where: {
        id: match.id,
      },
      update: {
        matchDateTime: matchData.matchDateTime,
        isHomeGame: matchData.isHomeGame,
        type: matchType,
      },
      create: matchData,
    });

    const upsertedMatch = await prisma.match.findUnique({
      where: {
        id: match.id,
      },
      include: {
        location: true,
      },
    });

    if (upsertedMatch) {
      await prisma.location.update({
        where: {
          matchId: upsertedMatch.id,
        },
        data: {
          city: match.location.address.city + " " + match.location.address.zip,
          hallName: match.location.name,
          streetAddress: match.location.address.street,
        },
      });
    }

    console.info(
      `Upserted match: ${upsertedMatch?.enemyClubName} (${upsertedMatch?.matchDateTime.toLocaleDateString()})`
    );
  }
}

export async function fetchTtApiMatches() {
  const matchesPromise = await fetch(
    "https://tt-api.ttc-klingenmuenster.de/api/v1/matches",
    {
      headers: {
        "Content-Type": "application/json",
        ...(TT_API_KEY && { Authorization: TT_API_KEY }),
      },
      cache: "no-store",
    }
  );

  const matchData = (await matchesPromise.json()) as TTApiMatchesReturnType;
  return matchData;
}


export async function upsertMatchesByIds(matchIds: string[]) {
  const matchData = await fetchTtApiMatches();
  const filteredMatches = matchData.matches.filter((match) =>
    matchIds.includes(match.id)
  );

  await processMatches(filteredMatches);
  return filteredMatches;
}
