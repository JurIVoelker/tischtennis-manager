import slugify from "slugify";
import { prisma } from "./prisma/prisma";

export interface ClubTeamParams {
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
  return paths;
}
