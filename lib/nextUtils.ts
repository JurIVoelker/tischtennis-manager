import slugify from "slugify";
import { prisma } from "./prisma/prisma";
import { asyncLog } from "./logUtils";

export interface ClubTeamParams {
  club: string;
  team: string;
}

export interface MatchPageParams {
  matchId: string;
  club: string;
  team: string;
}

export async function decodeClubTeamParams(
  paramsPromise: Promise<ClubTeamParams>
) {
  const params = await paramsPromise;
  const clubSlug = decodeURIComponent(params.club);
  const teamSlug = decodeURIComponent(params.team);
  return { clubSlug, teamSlug };
}

export async function generateTeamPageParams() {
  const clubs = await prisma.club.findMany({
    include: {
      teams: true,
    },
  });

  const paths: ClubTeamParams[] = [];

  clubs.forEach((club) => {
    club.teams.forEach((team) => {
      paths.push({
        club: slugify(club.slug),
        team: slugify(team.slug),
      });
    });
  });
  asyncLog(
    "info",
    `Generated ${paths.length} team page paths: ${JSON.stringify({
      paths: paths,
    })}`
  );
  return paths;
}

export async function generateEditMatchParams() {
  const clubs = await prisma.club.findMany({
    include: {
      teams: {
        include: {
          matches: true,
        },
      },
    },
  });

  const paths: MatchPageParams[] = [];

  clubs.forEach((club) => {
    club.teams.forEach((team) => {
      team.matches.forEach((match) => {
        paths.push({
          matchId: match.id,
          club: slugify(club.slug),
          team: slugify(team.slug),
        });
      });
    });
  });
  return paths;
}

export async function decodeMatchPageParams(
  paramsPromise: Promise<MatchPageParams>
) {
  const params = await paramsPromise;
  const matchId = decodeURIComponent(params.matchId);
  return { matchId };
}
