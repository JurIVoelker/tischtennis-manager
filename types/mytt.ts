export type League =
  | "Kreisklasse A"
  | "Kreisklasse B"
  | "Kreisklasse C"
  | "Kreisliga"
  | "Bezirksklasse"
  | "Bezirksliga"
  | "1. Pfalzliga"
  | "2. Pfalzliga"
  | "Pfalzliga"
  | "Oberliga"
  | "Bezirksoberliga"
  | "Regionalliga"
  | "2. Bundesliga"
  | "DTTL"
  | "unknown";

export type LeagueInfo = {
  league: League;
  teamType: string;
};

export type RawGameData = {
  date: string;
  hallLink: string;
  time: string;
  hall: string;
  leagueNickname: string;
  homeTeam: string;
  awayTeam: string;
  result: string | null;
  hallIndex: string;
};

export type GameData = RawGameData & {
  league: League;
  teamType: string;
  isHomeGame: boolean;
  ownTeamIndex: string;
  ownTeamName: string;
  enemyClub: string;
};

export type GameDataWithHall = RawGameData & {
  league: League;
  teamType: string;
  isHomeGame: boolean;
  ownTeamIndex: string;
  ownTeamName: string;
  enemyClub: string;
  hall: {
    hallIndex: string;
    hallName: string;
    hallStreet: string;
    hallZip: string;
    hallCity: string;
  };
};

export type HallFetchData = { club: string; path: string | null };

export type HallData = {
  [x: string]: {
    hallIndex: string;
    hallName: string;
    hallStreet: string;
    hallZip: string;
    hallCity: string;
  }[];
}[];
