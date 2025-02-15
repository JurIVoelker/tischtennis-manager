import {
  Club,
  Lineup,
  Location,
  Match,
  MatchAvailabilityVote,
  Player,
  Team,
  TeamLeader,
} from "@prisma/client";

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

export type TeamWithTeamLeaders = Team & {
  teamLeader: TeamLeader[];
};

export type TeamWithTeamLeadersAndTeamLeaderInvites = Team & {
  teamLeader: TeamLeader[];
  teamLeaderInvite: {
    id: string;
    expiresAt: Date;
    email: string;
    fullName: string;
  }[];
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

export type AvailabilityVoteWithPlayer = MatchAvailabilityVote & {
  player: Player;
};

export const matchAvailablilites = [
  "available",
  "maybe",
  "unavailable",
  "unknown",
];

export type MatchAvailablilites =
  | "available"
  | "maybe"
  | "unavailable"
  | "unknown";
