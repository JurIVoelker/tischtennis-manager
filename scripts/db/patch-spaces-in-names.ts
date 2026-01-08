import { prisma } from "@/lib/prisma/prisma";

(async () => {
  const existingPlayers = await prisma.player.findMany();

  for (const player of existingPlayers) {
    if (player.firstName.includes(" ") || player.lastName.includes(" ")) {
      console.log(`Patching player ${player.firstName} ${player.lastName}`);
      await prisma.player.update({
        where: { id: player.id },
        data: {
          firstName: player.firstName.trim(),
          lastName: player.lastName.trim()
        },
      })
    }
  }
})();