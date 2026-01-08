import { TTApiPlayer } from "@/scripts/db/patch-player-priority";

export const getPriority = (player: TTApiPlayer, teamIndex: number): number => {
  return teamIndex * 100 + parseInt(player.position.toString());
}