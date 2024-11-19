import { prisma } from "@/lib/prisma/prisma";
import readline from "node:readline";
import slugify from "slugify";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createClub = async (clubName: string) => {
  return await prisma.club.create({
    data: {
      name: clubName,
      slug: slugify(clubName),
    },
  });
};

const createTeam = async (clubId: string, teamName: string) => {
  return await prisma.team.create({
    data: {
      name: teamName,
      slug: slugify(teamName),
      clubId,
    },
  });
};

const createPlayer = async (teamId: string, playerName: string) => {
  return await prisma.player.create({
    data: {
      firstName: playerName,
      lastName: "Mustermann",
      teamId,
    },
  });
};

const createMatch = async (teamId: string, enemyTeamName: string) => {
  return await prisma.match.create({
    data: {
      teamId,
      matchDateTime: new Date().toISOString(),
      enemyClubName: enemyTeamName,
      isHomeGame: true,
    },
  });
};

const createLineup = async (matchId: string, playerIds: string[]) => {
  for (let i = 0; i < playerIds.length; i++) {
    await prisma.lineup.create({
      data: {
        matchId,
        playerId: playerIds[i],
        position: i + 1,
      },
    });
  }
};

const createLocations = async (matchId: string) => {
  await prisma.location.create({
    data: {
      hallName: "Location Hall",
      streetAddress: "Test Street",
      postalCode: "12345",
      city: "City 2",
      matchId,
    },
  });

  await prisma.location.create({
    data: {
      hallName: "Test Location",
      streetAddress: "Test Street",
      postalCode: "12345",
      city: "Test City",
      matchId,
    },
  });
};

const addTeamAuth = async (teamId: string) => {
  return await prisma.teamAuth.create({
    data: {
      teamId,
      token: "test-token",
    },
  });
};

const createFullTeamSetup = async (
  clubId: string,
  teamName: string,
  playerNames: string[],
  enemyTeamNames: string[]
) => {
  const team = await createTeam(clubId, teamName);
  const teamId = team.id;

  const teamAuth = await addTeamAuth(teamId);
  console.log(teamAuth);

  const playerIds = [];
  for (const name of playerNames) {
    const player = await createPlayer(teamId, name);
    playerIds.push(player.id);
  }

  for (const enemyTeamName of enemyTeamNames) {
    const match = await createMatch(teamId, enemyTeamName);
    const matchId = match.id;

    if (Math.random() > 0.25) {
      await createLineup(matchId, playerIds);
    }
    await createLocations(matchId);
  }

  return teamId;
};

const executeDatabaseScripts = async () => {
  const clubName = "Test Club";
  const club = await createClub(clubName);
  const clubId = club.id;
  const enemyTeamNames = ["EnemyClub I", "Other Enemy II"];

  const teamName = "Herren I";
  const playerNames = ["Max", "Moritz", "Erika", "Hans", "Klaus"];
  await createFullTeamSetup(clubId, teamName, playerNames, enemyTeamNames);

  const teamName2 = "Herren II";
  await createFullTeamSetup(clubId, teamName2, playerNames, enemyTeamNames);

  const teamName3 = "Herren III";
  await createFullTeamSetup(clubId, teamName3, playerNames, enemyTeamNames);

  const teamName4 = "Herren IV";
  const playerNames4 = ["Anna", "Berta", "Clara", "Dora", "Eva"];
  await createFullTeamSetup(clubId, teamName4, playerNames4, enemyTeamNames);

  const teamName5 = "Herren V";
  const playerNames5 = ["Fritz", "Gustav", "Heinz", "Inge", "Jürgen"];
  await createFullTeamSetup(clubId, teamName5, playerNames5, enemyTeamNames);

  const teamName6 = "Herren VI";
  const playerNames6 = ["Karl", "Ludwig", "Marta", "Nina", "Otto"];
  await createFullTeamSetup(clubId, teamName6, playerNames6, enemyTeamNames);

  const teamName7 = "Herren VII";
  const playerNames7 = ["Paula", "Quentin", "Rita", "Siegfried", "Tina"];
  await createFullTeamSetup(clubId, teamName7, playerNames7, enemyTeamNames);
};

const runScripts = async () => {
  const models = [
    "lineup",
    "player",
    "location",
    "match",
    "teamAuth",
    "team",
    "club",
  ];
  for (const model of models) {
    // @ts-ignore
    await prisma[model].deleteMany();
  }
  await executeDatabaseScripts();
};

const setupDatabase = async () => {
  const args = process.argv.slice(2);
  const isForce = args.includes("--force");
  if (!isForce && process.env.NODE_ENV === "production") {
    console.error("Cannot run this script in production mode.");
  }
  if (isForce) {
    await runScripts();
  } else {
    rl.question(
      "Are you sure you want to delete all database data and continue with importing the data? (y/n) ",
      async (answer) => {
        if (answer.toLowerCase() === "y") {
          await runScripts();
          rl.close();
        } else {
          console.log("Operation cancelled.");
          rl.close();
        }
      }
    );
  }
};

setupDatabase().then(() => {
  process.exit(0);
});
