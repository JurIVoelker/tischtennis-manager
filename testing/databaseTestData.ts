import { prisma } from "@/lib/prisma/prisma";
import { MatchAvailablilites } from "@/types/prismaTypes";
import slugify from "slugify";

const createClub = async (clubName: string) => {
  return await prisma.club.create({
    data: {
      name: clubName,
      slug: slugify(clubName),
    },
  });
};

const createClubAuth = async (clubId: string) => {
  return await prisma.owner.create({
    data: {
      clubId,
      email: "jurivoelker03@gmail.com",
    },
  });
};

const addTeamPosition = async (
  teamId: string,
  playerId: string,
  position: number
) => {
  return await prisma.playerTeamPosition.create({
    data: {
      teamId,
      position,
      playerId,
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

const addTeamLeader = async (teamId: string) => {
  return await prisma.teamLeader.create({
    data: {
      teamId,
      email: "jurivoelker03@gmail.com",
    },
  });
};

const createPlayer = async (
  teamId: string,
  firstName: string,
  lastName: string
) => {
  return await prisma.player.create({
    data: {
      firstName,
      lastName,
      teamId,
    },
  });
};

const createMatch = async (teamId: string, enemyTeamName: string) => {
  const matchDate = new Date();
  matchDate.setMonth(matchDate.getMonth() + 1);
  return await prisma.match.create({
    data: {
      teamId,
      matchDateTime: matchDate.toISOString(),
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
        position: i + 1,
        playerId: playerIds[i],
      },
    });
  }
};

const createMatchAvailabilityVote = async (
  matchId: string,
  playerId: string,
  availability: MatchAvailablilites
) => {
  return await prisma.matchAvailabilityVote.create({
    data: {
      matchId,
      playerId,
      availability,
    },
  });
};

const createLocation = async (matchId: string) => {
  await prisma.location.create({
    data: {
      hallName: "Location Hall",
      streetAddress: "Test Street",
      city: "City 2",
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
  players: { firstName: string; lastName: string }[],
  enemyTeamNames: string[],
  isAddTeamLeader: boolean = false
) => {
  const team = await createTeam(clubId, teamName);
  const teamId = team.id;

  if (isAddTeamLeader) addTeamLeader(teamId);

  const teamAuth = await addTeamAuth(teamId);
  console.log(teamAuth);

  const playerIds = [];
  for (const player of players) {
    const createdPlayer = await createPlayer(
      teamId,
      player.firstName,
      player.lastName
    );
    playerIds.push(createdPlayer.id);
  }

  for (let i = 0; i < playerIds.length; i++) {
    const playerId = playerIds[i];
    addTeamPosition(teamId, playerId, i + 1);
  }

  for (const enemyTeamName of enemyTeamNames) {
    const match = await createMatch(teamId, enemyTeamName);
    const matchId = match.id;

    if (Math.random() > 0.25) {
      await createLineup(matchId, playerIds);
    }

    for (const playerId of playerIds) {
      if (Math.random() > 0.66) {
        await createMatchAvailabilityVote(matchId, playerId, "available");
      } else if (Math.random() > 0.66) {
        await createMatchAvailabilityVote(matchId, playerId, "unavailable");
      } else if (Math.random() > 0.66) {
        await createMatchAvailabilityVote(matchId, playerId, "maybe");
      }
    }

    await createLocation(matchId);
  }

  return teamId;
};

const executeDatabaseScripts = async () => {
  const clubName = "Test Club";
  const club = await createClub(clubName);
  const clubId = club.id;
  const enemyTeamNames = ["EnemyClub I", "Other Enemy II"];

  await createClubAuth(clubId);

  const teamName = "Herren I";
  const players = [
    { firstName: "Max", lastName: "Mustermann" },
    { firstName: "Max", lastName: "Master" },
    { firstName: "Erika", lastName: "Mustermann" },
    { firstName: "Hans", lastName: "Mustermann" },
    { firstName: "Klaus", lastName: "Mustermann" },
  ];
  await createFullTeamSetup(clubId, teamName, players, enemyTeamNames, true);

  const teamName2 = "Herren II";
  await createFullTeamSetup(clubId, teamName2, players, enemyTeamNames);

  const teamName3 = "Herren III";
  await createFullTeamSetup(clubId, teamName3, players, enemyTeamNames, true);

  const teamName4 = "Herren IV";
  const players4 = [
    { firstName: "Anna", lastName: "Mustermann" },
    { firstName: "Berta", lastName: "Mustermann" },
    { firstName: "Clara", lastName: "Mustermann" },
    { firstName: "Dora", lastName: "Mustermann" },
    { firstName: "Eva", lastName: "Mustermann" },
  ];
  await createFullTeamSetup(clubId, teamName4, players4, enemyTeamNames);

  const teamName5 = "Herren V";
  const players5 = [
    { firstName: "Fritz", lastName: "Mustermann" },
    { firstName: "Gustav", lastName: "Mustermann" },
    { firstName: "Heinz", lastName: "Mustermann" },
    { firstName: "Inge", lastName: "Mustermann" },
    { firstName: "Jürgen", lastName: "Mustermann" },
  ];
  await createFullTeamSetup(clubId, teamName5, players5, enemyTeamNames);

  const teamName6 = "Herren VI";
  const players6 = [
    { firstName: "Karl", lastName: "Mustermann" },
    { firstName: "Ludwig", lastName: "Mustermann" },
    { firstName: "Marta", lastName: "Mustermann" },
    { firstName: "Nina", lastName: "Mustermann" },
    { firstName: "Otto", lastName: "Mustermann" },
  ];
  await createFullTeamSetup(clubId, teamName6, players6, enemyTeamNames);

  const teamName7 = "Herren VII";
  const players7 = [
    { firstName: "Paula", lastName: "Mustermann" },
    { firstName: "Quentin", lastName: "Mustermann" },
    { firstName: "Rita", lastName: "Mustermann" },
    { firstName: "Siegfried", lastName: "Mustermann" },
    { firstName: "Tina", lastName: "Mustermann" },
  ];
  await createFullTeamSetup(clubId, teamName7, players7, enemyTeamNames, true);
};

const runScripts = async () => {
  const models = [
    "lineup",
    "location",
    "match",
    "teamLeader",
    "teamAuth",
    "playerTeamPosition",
    "player",
    "team",
    "owner",
    "club",
  ];
  for (const model of models) {
    // @ts-expect-error: Model deletion might not be typed correctly
    await prisma[model].deleteMany();
  }
  await executeDatabaseScripts();
};

runScripts().then(() => {
  process.exit(0);
});
