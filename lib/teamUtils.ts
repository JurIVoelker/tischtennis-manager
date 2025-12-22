import { TeamWithPlayers } from "@/types/prismaTypes";
import { Player } from "@prisma/client";
import { romanToInt } from "./romanUtils";

const getTeamIndex = (teamName: string) => {
  const splitTeamName = teamName.split(" ");
  return romanToInt(splitTeamName[splitTeamName.length - 1]);
}

export const sortPlayersByTeam = (players: Player[], teams: TeamWithPlayers[], teamName: string) => {
  const teamsWithEqualType = getTeamsWithEqualType({ teamName, teams, excludeOwn: false });

  const sortPriorityList: { playerId: string, priority: number }[] = []

  console.log("Target: " + players.flatMap(p => p.id));
  console.log("teams: " + teams.flatMap(t => t.players).flatMap(p => p.id));

  teamsWithEqualType.forEach((team) => {
    team.players.forEach((player, index) => {
      const teamIndex = getTeamIndex(team.name);
      sortPriorityList.push({
        playerId: player.id,
        priority: teamIndex * 100 + index + 1,
      });
    })
  })

  const orderedPlayers: Player[] = sortPriorityList.map((item) => players.find((p) => p.id === item.playerId)).filter((player) => player !== undefined);
  return orderedPlayers;
}

export const getTeamsWithEqualType = ({ teamName, teams, excludeOwn }: { teamName: string, teams: TeamWithPlayers[], excludeOwn?: boolean }) => {
  const splitTeamName = teamName.split(" ");
  const teamType = splitTeamName.slice(0, -1).join(" ");
  const teamIndex = romanToInt(splitTeamName[splitTeamName.length - 1]);
  const availableAlternativeTeams = teams.filter((team) => {
    const splitTeam = team.name.split(" ");
    const teamIndexCurrent = romanToInt(splitTeam[splitTeam.length - 1]);
    if (excludeOwn && team.name === teamName) return false;
    else if (excludeOwn === false && team.name === teamName) return true;

    return (
      team.name.startsWith(teamType) &&
      teamIndex < teamIndexCurrent
    );
  });
  return availableAlternativeTeams;
}
