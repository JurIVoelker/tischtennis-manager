import { prisma } from "@/lib/prisma/prisma";
import slugify from "slugify";

const { TT_API_KEY } = process.env;

if (!TT_API_KEY) {
  throw new Error("Missing TT_API_KEY");
}

type TTApiMatchesReturnType = {
  matches: {
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

(async () => {
  const matchesPromise = await fetch(
    "https://tt-api.ttc-klingenmuenster.de/api/v1/matches",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: TT_API_KEY,
      },
    }
  );

  const matchData = (await matchesPromise.json()) as TTApiMatchesReturnType;

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

  for (const match of matchData.matches) {
    const { street, city, zip } = match.location.address;

    const teamName = match.isHomeGame
      ? match.teams.home.name
      : match.teams.away.name;

    const enemyName = match.isHomeGame
      ? match.teams.away.name
      : match.teams.home.name;

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

    const matchData = {
      id: match.id,
      enemyClubName: enemyName,
      isHomeGame: match.isHomeGame,
      matchDateTime: new Date(match.datetime),
      location: {
        connectOrCreate: {
          where: {
            id: match.location.id,
          },
          create: {
            city: city + " " + zip,
            hallName: match.location.name,
            streetAddress: street,
          },
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
      },
      create: matchData,
    });
  }
})();
