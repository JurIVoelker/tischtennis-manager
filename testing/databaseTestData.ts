import { prisma } from "@/lib/prisma/prisma";
import readline from "node:readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const executeDatabaseScripts = async () => {
  const clubId = (
    await prisma.club.create({
      data: {
        name: "Test Club",
      },
    })
  ).id;

  const teamId = (
    await prisma.team.create({
      data: {
        name: "Herren I",
        clubId,
      },
    })
  ).id;

  const playerNames = ["Max", "Moritz", "Erika", "Hans", "Klaus"];

  const playerIds = [];
  for (const name of playerNames) {
    const res = await prisma.player.create({
      data: {
        firstName: name,
        lastName: "Mustermann",
        teamId,
      },
    });
    playerIds.push(res.id);
  }

  const matchId = (
    await prisma.match.create({
      data: {
        teamId,
        matchDateTime: new Date().toISOString(),
        enemyClubName: "EnemyClub I",
        isHomeGame: true,
      },
    })
  ).id;

  await prisma.location.create({
    data: {
      hallName: "Test Location",
      streetAddress: "Test Street",
      postalCode: "12345",
      city: "Test City",
      matchId,
    },
  });

  await prisma.lineup.create({
    data: {
      matchId,
      playerId: playerIds[0],
      position: 1,
    },
  });

  await prisma.lineup.create({
    data: {
      matchId,
      playerId: playerIds[1],
      position: 2,
    },
  });

  await prisma.lineup.create({
    data: {
      matchId,
      playerId: playerIds[2],
      position: 3,
    },
  });

  await prisma.lineup.create({
    data: {
      matchId,
      playerId: playerIds[3],
      position: 4,
    },
  });

  await prisma.lineup.create({
    data: {
      matchId,
      playerId: playerIds[4],
      position: 5,
    },
  });
};

const setupDatabase = async () => {
  if (process.env.NODE_ENV === "production") {
    console.error("Cannot run this script in production mode.");
  }
  rl.question(
    "Are you sure you want to delete all database data and continue with importing the data? (y/n) ",
    async (answer) => {
      if (answer.toLowerCase() === "y") {
        const models = [
          "lineup",
          "player",
          "location",
          "match",
          "team",
          "club",
        ];
        for (const model of models) {
          // @ts-ignore
          await prisma[model].deleteMany();
        }
        await executeDatabaseScripts();
        rl.close();
      } else {
        console.log("Operation cancelled.");
        rl.close();
      }
    }
  );
};

setupDatabase();
