import { getInfoTextString, getWeekdayName } from "@/lib/stringUtils";
import { MatchWithLineupAndLocation } from "@/types/prismaTypes";
import assert from "node:assert";
import test, { describe } from "node:test";

const defaultDummyLineup = {
  id: "ID_1",
  player: {
    firstName: "Name 1",
    id: "ID",
    lastName: "Last Name",
    teamId: "Team ID",
  },
  position: 1,
  matchId: "Match ID",
  playerId: "Player ID",
};

const defaultDummyMatch: MatchWithLineupAndLocation = {
  enemyClubName: "Enemy Club Name",
  id: "ID",
  lineups: [defaultDummyLineup],
  isHomeGame: true,
  location: {
    city: "City",
    id: "ID",
    hallName: "Hall Name",
    matchId: "Match ID",
    streetAddress: "Street Address",
  },
  matchDateTime: new Date(Date.now()),
  teamId: "Team ID",
};

describe("test date and name", () => {
  test("includes expected date and weekday name", () => {
    const dummyMatch = JSON.parse(JSON.stringify(defaultDummyMatch));
    const matchDate = new Date("2024-11-20T08:00:00");

    dummyMatch.matchDateTime = matchDate;
    const infoText = getInfoTextString(dummyMatch);

    assert(infoText);
    assert(infoText.includes("20.11.2024"));
    assert(infoText.includes("Mittwoch"));
  });

  test("correct formatting for date > 1 week", () => {
    const dummyMatch = JSON.parse(JSON.stringify(defaultDummyMatch));
    const addDays = 10;
    const matchDate = new Date(Date.now() + addDays * 24 * 60 * 60 * 1000);
    const weekdayName = getWeekdayName(matchDate);

    dummyMatch.matchDateTime = matchDate;
    const infoText = getInfoTextString(dummyMatch);

    assert(infoText);
    const regex = new RegExp(
      `Am ${weekdayName}, dem \\d{2}\\.\\d{2}\\.\\d{4} um \\d{2}:\\d{2}.*`
    );
    assert(regex.test(infoText));
  });

  test("correct formatting for date < 1 week", () => {
    const dummyMatch = JSON.parse(JSON.stringify(defaultDummyMatch));
    const addDays = 5;
    const matchDate = new Date(Date.now() + addDays * 24 * 60 * 60 * 1000);
    const weekdayName = getWeekdayName(matchDate);

    dummyMatch.matchDateTime = matchDate;
    const infoText = getInfoTextString(dummyMatch);

    assert(infoText);
    const regex = new RegExp(
      `Am ${weekdayName} \\(\\d{2}\\.\\d{2}\\.\\d{4}\\) um \\d{2}:\\d{2}.*`
    );
    assert(regex.test(infoText));
  });

  test("correct formatting for tomorrow", () => {
    const dummyMatch = JSON.parse(JSON.stringify(defaultDummyMatch));
    const addDays = 1;
    const matchDate = new Date(Date.now() + addDays * 24 * 60 * 60 * 1000);

    dummyMatch.matchDateTime = matchDate;
    const infoText = getInfoTextString(dummyMatch);

    assert(infoText);
    const regex = new RegExp(
      `Morgen \\(\\d{2}\\.\\d{2}\\.\\d{4}\\) um \\d{2}:\\d{2}.*`
    );
    assert(regex.test(infoText));
  });

  test("correct formatting for today", () => {
    const dummyMatch = JSON.parse(JSON.stringify(defaultDummyMatch));
    const matchDate = new Date(Date.now());

    dummyMatch.matchDateTime = matchDate;
    const infoText = getInfoTextString(dummyMatch);

    assert(infoText);
    const regex = new RegExp(`Heute um \\d{2}:\\d{2}.*`);
    assert.strict(regex.test(infoText));
  });
});

describe("game location", () => {
  test("home game", () => {
    const dummyMatch = defaultDummyMatch;
    const infoText = getInfoTextString(dummyMatch);
    assert(infoText);
    assert(infoText.includes("Heimspiel"));
  });
  test("test game at enemies", () => {
    const dummyMatch = defaultDummyMatch;
    dummyMatch.isHomeGame = false;
    const infoText = getInfoTextString(dummyMatch);
    assert(infoText);
    assert(infoText.includes("Auswährtsspiel"));
  });
});

describe("test lineup", () => {
  test("lineup sorted and correctly formatted", () => {
    const dummyMatch: MatchWithLineupAndLocation = defaultDummyMatch;
    for (let i = 10; i > 1; i--) {
      dummyMatch.lineups.push({
        ...defaultDummyLineup,
        id: `ID_${i}`,
        player: {
          ...defaultDummyLineup.player,
          firstName: `Name ${i}`,
        },
        position: i + 1,
      });
    }
    const expectedText = Array.from({ length: 10 })
      .map((_, i) => `  ${i + 1}. Name ${i + 1}`)
      .join("\n");

    const infoText = getInfoTextString(dummyMatch);
    assert(infoText);
    assert(infoText.includes(expectedText));
  });
});

describe("false args", () => {
  test("null as match", () => {
    // @ts-expect-error: Testing null input for getInfoTextString
    const infoText = getInfoTextString(null);
    assert(infoText === null);
  });

  test("without lineup", () => {
    const dummyMatch = JSON.parse(JSON.stringify(defaultDummyMatch));
    delete dummyMatch.lineups;

    const infoText = getInfoTextString(dummyMatch);
    assert(infoText === null);
  });

  test("without datetime", () => {
    const dummyMatch = JSON.parse(JSON.stringify(defaultDummyMatch));
    delete dummyMatch.matchDateTime;

    const infoText = getInfoTextString(dummyMatch);
    assert(infoText === null);
  });

  test("without enemy team name", () => {
    const dummyMatch = JSON.parse(JSON.stringify(defaultDummyMatch));
    delete dummyMatch.enemyClubName;

    const infoText = getInfoTextString(dummyMatch);
    assert(infoText === null);
  });
});
