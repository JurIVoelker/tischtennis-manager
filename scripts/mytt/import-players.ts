import { prisma } from "@/lib/prisma/prisma";
import "dotenv/config";
import slugify from "slugify";
(async () => {
  const playersRequest = await fetch(
    "https://tt-api.ttc-klingenmuenster.de/api/v1/players",
    {
      headers: {
        Authorization: process.env.TT_API_KEY || "",
      },
    }
  );

  type TTApiPlayersReturnType = {
    playerData: {
      teamName: string;
      players: {
        name: string;
        QTTR: number;
        position: number;
      }[];
    }[];
    meta: {
      id: number;
      expiresAt: string;
    };
  };

  const playersData = (await playersRequest.json()) as TTApiPlayersReturnType;

  for (const fetchedTeam of playersData.playerData) {
    const clubId = (
      await prisma.club.findFirst({
        where: { slug: process.env.CLUB_SLUG || "ttc" },
      })
    )?.id;

    if (!clubId) {
      console.error(`Club with slug ${process.env.CLUB_SLUG} not found.`);
      break;
    }

    let existingTeam = await prisma.team.findFirst({
      where: {
        slug: slugify(fetchedTeam.teamName),
      },
    });

    if (!existingTeam) {
      existingTeam = await prisma.team.create({
        data: {
          name: fetchedTeam.teamName,
          slug: slugify(fetchedTeam.teamName),
          clubId,
          teamAuth: {
            create: {
              token:
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15),
            },
          },
        },
      });
    }

    const existingPlayers = await prisma.player.findMany({
      where: {
        teamId: existingTeam.id,
      },
    });

    const targetPlayers = fetchedTeam.players.filter((p) => {
      return !existingPlayers.some(
        (ep) =>
          ep.firstName === p.name.split(", ").slice(1).join(" ") &&
          ep.lastName === p.name.split(", ")[0]
      );
    });

    const players = await prisma.player.createManyAndReturn({
      data: targetPlayers.map((p) => ({
        firstName: p.name.split(", ").slice(1).join(" "),
        lastName: p.name.split(", ")[0],
        teamId: existingTeam?.id || "",
      })),
    });

    console.info(
      `Added ${players.length} players to team ${fetchedTeam.teamName}`
    );

    await prisma.playerTeamPosition.createMany({
      data: players.map((p, index) => ({
        position: fetchedTeam.players[index].position,
        playerId: p.id,
        teamId: existingTeam?.id || "",
      })),
    });
  }
})();
