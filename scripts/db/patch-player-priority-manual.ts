import { prisma } from "@/lib/prisma/prisma";
import { emptyPosition, getTeamBaseName } from "@/lib/teamUtils";

(async () => {
  const existingPlayers = await prisma.player.findMany({
    where: {
      positionPriority: {
        equals: emptyPosition
      }
    },
    include: {
      team: true
    }
  });

  let input = "";

  while (input.toLowerCase() !== "exit") {
    console.log(
      `Players with positionPriority 0:
${existingPlayers.map((p, i) => `[${i}]: ${p.firstName} ${p.lastName} (${p.team.name})`).join("\n")}
`
    );

    const userInput = await new Promise<string>((resolve) => {
      process.stdout.write(
        'Enter the number of the player to set priority (or type "exit" to quit): '
      );
      process.stdin.once("data", (data) => {
        resolve(data.toString().trim());
      });
    });

    input = userInput;
    if (input.toLowerCase() === "exit") {
      console.log("Exiting...");
      process.exit(0);
    }

    const playerIndex = parseInt(input);
    if (isNaN(playerIndex) || playerIndex < 0 || playerIndex >= existingPlayers.length) {
      console.log("Invalid input. Please try again.");
      continue;
    }

    const selectedPlayer = existingPlayers[playerIndex];

    const priorityInput = await new Promise<string>((resolve) => {
      process.stdout.write(
        `Which position for ${selectedPlayer.firstName} ${selectedPlayer.lastName} (format: <teamIndex> <position>): `
      );
      process.stdin.once("data", (data) => {
        resolve(data.toString().trim());
      });
    });

    const teamIndex = parseInt(priorityInput.split(" ")?.[0]);
    const position = parseInt(priorityInput.split(" ")?.[1]);

    if (isNaN(teamIndex) || isNaN(position)) {
      console.log("\nInvalid input. Please try again.\n");
      continue;
    }

    const positionPriorityIndex = teamIndex * 100 + position;
    const teamBaseName = getTeamBaseName(selectedPlayer.team.name);
    const positionPriority = { ...emptyPosition, [teamBaseName]: positionPriorityIndex };

    await prisma.player.update({
      where: { id: selectedPlayer.id },
      data: { positionPriority },
    });

    console.log(`Updated ${selectedPlayer.firstName} ${selectedPlayer.lastName} with positionPriority ${positionPriority}`);
  }
})();