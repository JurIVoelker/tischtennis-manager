import { prisma } from "@/lib/prisma/prisma";
import { TTApiMatch, TTApiMatchesReturnType } from "@/scripts/mytt/importGames";
import "dotenv/config";
import { isEqual } from "date-fns";
const { TT_API_KEY } = process.env;

export const categorizeMatchInconsistencies = async (
  fetchedMatches: TTApiMatch[]
) => {
  let filteredMatches: TTApiMatch[] = [];

  const settings = await prisma.settings.findFirst();

  if (settings?.includeRRSync === false) {
    filteredMatches = fetchedMatches.filter((match) => {
      const isRRMatch = new Date(match.datetime)
        .getMonth() >= 0 && new Date(match.datetime).getMonth() <= 5

      return !isRRMatch;
    });
  } else {
    filteredMatches = fetchedMatches;
  }

  filteredMatches = filteredMatches.filter((match) => {
    const matchDate = new Date(match.datetime);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    return matchDate >= currentDate;
  })

  const missingMatches = [];
  const unequalTimeMatches = [];
  const unequalTimeMatchesBefore = [];
  const unequalHomeGameMatches = [];
  const unequalLocationMatches = [];
  const unequalLocationMatchesBefore = [];

  for (const fetchedMatch of filteredMatches) {
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
      !isEqual(new Date(match.matchDateTime), new Date(fetchedMatch.datetime))
    ) {
      unequalTimeMatchesBefore.push(match);
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
      unequalLocationMatchesBefore.push(match);
    }
  }

  return {
    missingMatches,
    unequalTimeMatches,
    unequalHomeGameMatches,
    unequalLocationMatches,
  };
};

export const getTTApiMatches = async () => {
  let fetchedMatches;
  try {
    const request = await fetch(
      "https://tt-api.ttc-klingenmuenster.de/api/v1/matches",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: TT_API_KEY || "",
        },
        cache: "no-store",
      }
    );

    if (!request.ok) {
      console.error(request.status);
      throw new Error("Failed to fetch matches from TT API");
    }

    fetchedMatches = (await request.json()) as TTApiMatchesReturnType;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch matches from TT API");
  }

  return fetchedMatches;
};
