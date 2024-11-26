import { Club, Lineup, Location, Match, Player, Team } from "@prisma/client";

export type LineupWithPlayers = Lineup & {
  player: Player;
};

export type MatchWithLineupAndLocation = Match & {
  location: Location | null;
  lineups: LineupWithPlayers[];
};

export type TeamWithPlayersAndMatches = Team & {
  players: Player[];
  matches: MatchWithLineupAndLocation[];
};

export type ClubWithTeams =
  | (Club & {
      teams: TeamWithPlayersAndMatches[];
    })
  | null;

export type MatchWithLocation =
  | (Match & {
      location: Location | null;
    })
  | null;
