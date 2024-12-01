import { Club, Lineup, Location, Match, Player, Team } from "@prisma/client";

export type LineupWithPlayers = Lineup & {
  player: Player;
};

export type MatchWithLineupAndLocation = Match & {
  location: Location | null;
  lineups: LineupWithPlayers[];
};

export type MatchWithLineup = Match & {
  lineups: LineupWithPlayers[];
};

export type MatchWithLineupAndTeam = Match & {
  lineups: LineupWithPlayers[];
  team: Team;
};

export type TeamWithPlayersAndMatches = Team & {
  players: Player[];
  matches: MatchWithLineupAndLocation[];
};

export type TeamWithPlayers = Team & {
  players: Player[];
};

export type TeamWithMatches = Team & {
  matches: MatchWithLineupAndLocation[];
};

export type ClubWithTeams =
  | (Club & {
      teams: TeamWithPlayersAndMatches[];
    })
  | null;

export type ClubWithTeamsWithoutMatches =
  | (Club & {
      teams: TeamWithMatches[];
    })
  | null;

export type MatchWithLocation =
  | (Match & {
      location: Location | null;
    })
  | null;
