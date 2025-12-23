import { sortPlayersByTeam } from "@/lib/teamUtils"
import { TeamWithPlayers } from "@/types/prismaTypes"
import { Player } from "@prisma/client"
// @ts-expect-error bun not avaliable on prod
import { test, expect } from "bun:test"


const getTeamId = (index: number): string => `team-${index}`

const getPlayerId = (teamIndex: number, pos: number): string => `id-${teamIndex * 100 + pos}`

const getPlayer = (pos: number, teamIndex: number): Player => {
  return { id: getPlayerId(teamIndex, pos), teamId: getTeamId(teamIndex), firstName: `FirstName${pos}`, lastName: `LastName${pos}` }
}

test("Sort players by same team", () => {
  const players = Array.from({ length: 5 }, (_, i) => getPlayer(i + 1, 1));
  const teams: TeamWithPlayers[] = [{
    id: getTeamId(1),
    name: "Mannschaft I",
    players,
    slug: "mannschaft-i",
    clubId: "club1",
  }]

  const targetPlayers = Array.from({ length: 5 }, (_, i) => getPlayer(i + 1, 1)).reverse()

  const sortedPlayers = sortPlayersByTeam(targetPlayers, teams, "Mannschaft I")
  const isSuccess = players.every((player, index) => player.id === sortedPlayers[index].id)
  expect(isSuccess).toBe(true)
})

test("Sort players by different teams", () => {
  const players1 = Array.from({ length: 5 }, (_, i) => getPlayer(i + 1, 1));
  const players2 = Array.from({ length: 5 }, (_, i) => getPlayer(i + 1, 2));

  const teams: TeamWithPlayers[] = [{
    id: getTeamId(1),
    name: "Mannschaft I",
    players: players1,
    slug: "mannschaft-i",
    clubId: "club1",
  }, {
    id: getTeamId(2),
    name: "Mannschaft II",
    players: players2,
    slug: "mannschaft-ii",
    clubId: "club1",
  },]

  const expectedPlayers = [...players1, ...players2]
  const targetPlayers = [...[...players2].reverse(), ...[...players1].reverse()];
  const sortedPlayers = sortPlayersByTeam(targetPlayers, teams, "Mannschaft I")

  const isSuccess = expectedPlayers.every((player, index) => player.id === sortedPlayers[index].id)
  expect(isSuccess).toBe(true)
})


test("Sort players by same team 2", () => {
  const players = Array.from({ length: 5 }, (_, i) => getPlayer(i + 1, 1));
  const teams: TeamWithPlayers[] = [{
    id: getTeamId(1),
    name: "Mannschaft I",
    players,
    slug: "mannschaft-i",
    clubId: "club1",
  }]

  const targetPlayers = [getPlayer(3, 1), getPlayer(5, 1), getPlayer(2, 1)]
  const expectedPlayers = [getPlayer(2, 1), getPlayer(3, 1), getPlayer(5, 1)]
  const sortedPlayers = sortPlayersByTeam(targetPlayers, teams, "Mannschaft I")
  const isSuccess = expectedPlayers.every((player, index) => player.id === sortedPlayers[index].id)
  expect(isSuccess).toBe(true)
})

test("Sort players by different teams 2", () => {
  const players1 = Array.from({ length: 5 }, (_, i) => getPlayer(i + 1, 1));
  const players2 = Array.from({ length: 5 }, (_, i) => getPlayer(i + 1, 2));

  const teams: TeamWithPlayers[] = [{
    id: getTeamId(1),
    name: "Mannschaft I",
    players: players1,
    slug: "mannschaft-i",
    clubId: "club1",
  }, {
    id: getTeamId(2),
    name: "Mannschaft II",
    players: players2,
    slug: "mannschaft-ii",
    clubId: "club1",
  },]

  const targetPlayers = [getPlayer(4, 2), getPlayer(1, 1), getPlayer(3, 1), getPlayer(2, 2), getPlayer(5, 1), getPlayer(1, 2)];
  const expectedPlayers = [getPlayer(1, 1), getPlayer(3, 1), getPlayer(5, 1), getPlayer(1, 2), getPlayer(2, 2), getPlayer(4, 2)];
  const sortedPlayers = sortPlayersByTeam(targetPlayers, teams, "Mannschaft I")

  const isSuccess = expectedPlayers.every((player, index) => player.id === sortedPlayers[index].id)
  expect(isSuccess).toBe(true)
})