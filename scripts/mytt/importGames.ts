import {
  GameData,
  GameDataWithHall,
  HallData,
  HallFetchData,
  League,
  RawGameData,
} from "@/types/mytt";
import "dotenv/config";
import { parse } from "node-html-parser";
import { prisma } from "@/lib/prisma/prisma";
import slugify from "slugify";
import { z } from "zod";

const fetchURL = process.env.MY_TT_GAMEPLAN || "";
const ownClubName = process.env.MY_TT_CLUB_NAME || "";
const clubSlug = process.env.CLUB_SLUG || "";
const myTTURL = process.env.MY_TT_URL || "";

const schema = z.object({
  fetchURL: z.string().nonempty(),
  ownClubName: z.string().nonempty(),
  clubSlug: z.string().nonempty(),
  myTTURL: z.string().nonempty(),
});

const { success, error } = schema.safeParse({
  fetchURL,
  ownClubName,
  clubSlug,
  myTTURL,
});

if (!success) {
  console.error(error);
  process.exit(1);
}

const fetchGamesHTML = async () => {
  const HTML = await (await fetch(fetchURL)).text();
  return HTML;
};

const convertToObject = async (html: string): Promise<Array<RawGameData>> => {
  const rows = parse(html).querySelectorAll("#playingPlanDesktop tbody tr");

  let prevDate = "";
  const obj = rows.map((row) => {
    const cells = row.querySelectorAll("td");
    const date = cells[0].text.trim().substring(4) || prevDate;
    prevDate = date;
    const time = cells[1].text.trim().split("\n")[0];
    const hall = cells[2].text.trim();
    const hallLink = cells[2].querySelector("a")?.getAttribute("href") || "";
    const hallIndex =
      cells[2].querySelector("a")?.text?.split("\n")?.join("") || "";
    const leagueNickname = cells[3].text.trim();
    const homeTeam = cells[4].text.trim();
    const awayTeam = cells[5].text.trim();
    const result = cells[8].text.trim() || null;
    return {
      date,
      time,
      hall,
      leagueNickname,
      homeTeam,
      awayTeam,
      result,
      hallLink,
      hallIndex,
    };
  });

  return obj;
};

const getTeamIndex = (teamName: string): string => {
  const romanRegex = /^(C|XC|L?X{0,3}(IX|IV|V?I{0,3}))$/;
  const splitTeamName = teamName.split(" ");
  const teamNumber = splitTeamName[splitTeamName.length - 1];
  if (!teamNumber.match(romanRegex)) {
    return "I";
  } else return teamNumber;
};

const getLeagueName = (leagueNickname: string): League => {
  if (leagueNickname.includes("KKA")) return "Kreisklasse A";
  if (leagueNickname.includes("KKB")) return "Kreisklasse B";
  if (leagueNickname.includes("KKC")) return "Kreisklasse C";
  if (leagueNickname.includes("KL")) return "Kreisliga";
  if (leagueNickname.includes("BK")) return "Bezirksklasse";
  if (leagueNickname.includes("BL")) return "Bezirksliga";
  if (leagueNickname.includes("1. PL")) return "1. Pfalzliga";
  if (leagueNickname.includes("2. PL")) return "2. Pfalzliga";
  if (leagueNickname.includes("PL")) return "Pfalzliga";
  if (leagueNickname.includes("BOL")) return "Bezirksoberliga";
  if (leagueNickname.includes("OL")) return "Oberliga";
  if (leagueNickname.includes("RL")) return "Regionalliga";
  if (leagueNickname.includes("2. BL")) return "2. Bundesliga";
  if (leagueNickname.includes("DTTL")) return "DTTL";
  console.log(`Could not determine league for ${leagueNickname}`);
  return "unknown";
};

const getTeamType = (leagueNickname: string) => {
  if (leagueNickname.includes("mJU")) {
    const ageIndex = leagueNickname.indexOf("mJU") + 3;
    const ageClass = parseInt(leagueNickname.slice(ageIndex, ageIndex + 2));
    return `Jungen ${ageClass}`;
  } else if (leagueNickname.startsWith("H")) {
    return "Herren";
  } else if (leagueNickname.includes("D")) {
    return "Damen";
  } else if (leagueNickname.includes("wJU")) {
    const ageIndex = leagueNickname.indexOf("wJU") + 3;
    const ageClass = parseInt(leagueNickname.slice(ageIndex, ageIndex + 2));
    return `Mädchen ${ageClass}`;
  } else if (leagueNickname.includes("BOL")) {
    return "Herren";
  }
  console.log(`Could not determine team type for ${leagueNickname} `);
  return leagueNickname;
};

const getClubName = (teamName: string): string => {
  const index = getTeamIndex(teamName);
  return teamName.endsWith(index)
    ? teamName.slice(0, -index.length).trim()
    : teamName.trim();
};

const transformData = (rawData: RawGameData[]): GameData[] =>
  rawData.map((game) => {
    const teamType = getTeamType(game.leagueNickname);
    const league = getLeagueName(game.leagueNickname);
    const isHomeGame = game.homeTeam.includes(ownClubName) ? true : false;
    const ownTeamIndex = getTeamIndex(
      isHomeGame ? game.homeTeam : game.awayTeam
    );
    const enemyClub = getClubName(isHomeGame ? game.awayTeam : game.homeTeam);
    const ownTeamName = teamType + " " + ownTeamIndex;
    return {
      ...game,
      league,
      teamType,
      isHomeGame,
      ownTeamIndex,
      ownTeamName,
      enemyClub,
    };
  });

const fetchHallsHTML = async (halls: HallFetchData[]) => {
  const promises = halls.map(async (hall) => {
    const response = await fetch(myTTURL + hall.path || "");
    return response.text();
  });
  const res = await Promise.all(promises);
  return res;
};

const convertToHallObject = (html: string) => {
  const root = parse(html);
  return root
    .querySelectorAll('div[data-match-height="addresses"]')
    .map((div) => div.text.trim())
    .filter((hall) => !hall.includes("Kontaktadresse"))
    .flatMap((hall) =>
      hall
        .split("Spiellokal")
        .filter((h) => h.trim().length > 1)
        .map((h) => {
          const [hallIndex, hallName, hallStreet, hallZip, hallCity] = h
            .split("\n")
            .filter(Boolean)
            .map((s) => s.trim());
          return { hallIndex, hallName, hallStreet, hallZip, hallCity };
        })
    );
};

const connectHallsToGames = (games: GameData[], halls: HallData) => {
  return (
    games.map((game) => {
      const targetClub = game.isHomeGame ? ownClubName : game.enemyClub;
      const hall = halls.find((hall) => hall[targetClub]);
      return {
        ...game,
        hall: hall?.[targetClub][parseInt(game.hallIndex) - 1] || {
          hallCity: "unbekannt",
          hallIndex: "unbekannt",
          hallName: "unbekannt",
          hallStreet: "unbekannt",
          hallZip: "unbekannt",
        },
      };
    }) || []
  );
};

const saveInDB = async (games: GameDataWithHall[]) => {
  const unsuccessfulGames = [];
  for (const game of games) {
    try {
      const teamSlug = slugify(game.ownTeamName.toLowerCase());
      let team = await prisma.team.findFirst({
        where: {
          club: {
            slug: clubSlug,
          },
          slug: teamSlug,
        },
      });

      if (!team) {
        team = await prisma.team.create({
          data: {
            club: {
              connect: {
                slug: clubSlug,
              },
            },
            teamAuth: {
              create: {
                token:
                  Math.random().toString(36).substring(7) +
                  Math.random().toString(36).substring(7),
              },
            },
            name: game.ownTeamName,
            slug: teamSlug,
          },
        });
      }

      const [day, month, year] = game.date.split(".");
      const [hours, minutes] = game.time.split(":");
      const date = new Date(`20${year}-${month}-${day}T${hours}:${minutes}:00`);
      date.setHours(date.getHours() - 1);

      const match = await prisma.match.create({
        data: {
          enemyClubName: game.isHomeGame ? game.awayTeam : game.homeTeam,
          isHomeGame: game.isHomeGame,
          matchDateTime: date,
          id: `auto-generated-${game.date}-${game.time}-${
            game.hallIndex
          }-${Math.random().toString(36).substring(7)}`,
          team: {
            connect: {
              id: team.id,
            },
          },
        },
      });
      if (game?.hall) {
        await prisma.location.create({
          data: {
            hallName: game?.hall?.hallName || "",
            streetAddress: game?.hall?.hallStreet || "",
            city: game?.hall?.hallCity || "",
            match: {
              connect: {
                id: match.id,
              },
            },
          },
        });
      }
    } catch (error) {
      console.error(error);
      unsuccessfulGames.push(`${game.homeTeam} vs ${game.awayTeam}`);
    }
  }

  console.log(
    `Created ${games.length - unsuccessfulGames.length} of ${
      games.length
    } games (${unsuccessfulGames.length} failed)`
  );

  if (unsuccessfulGames.length > 0) {
    console.log("Unsuccessful games:", unsuccessfulGames);
  }
};

const exec = async () => {
  const html = await fetchGamesHTML();
  const rawData = (await convertToObject(html))
    .filter((game) => game.result === null)
    .filter(
      (game) =>
        !(game.homeTeam === "spielfrei*" || game.awayTeam === "spielfrei*")
    );

  console.log(`Found ${rawData.length} games`);

  const transformedData = transformData(rawData);

  const hallsToFetch = transformedData.reduce<HallFetchData[]>(
    (acc, game) => {
      if (!acc.find((team) => team.club === game.enemyClub) && !game.isHomeGame)
        acc.push({ club: game.enemyClub, path: game.hallLink });
      return acc;
    },
    [
      {
        club: ownClubName,
        path: transformedData.find((game) => game.isHomeGame)?.hallLink || "",
      },
    ]
  );

  const hallHTML = await fetchHallsHTML(hallsToFetch);
  const halls = hallsToFetch.map((hall, i) => ({
    [hall.club]: convertToHallObject(hallHTML[i]),
  }));

  const games = connectHallsToGames(transformedData, halls);
  console.log({ game: games[0] });
  // @ts-expect-error ts confuses me and I have no idea how to fix it
  // await saveInDB(games);
};

exec();
