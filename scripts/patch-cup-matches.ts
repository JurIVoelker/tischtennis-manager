import { fetchTtApiMatches, processMatches } from "./mytt/importGames";

(async () => {
  const matches = await fetchTtApiMatches();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const filteredMatches = matches.matches.filter((match) => new Date(match.datetime) > today && match.league.name.toLowerCase().includes("pokal"));
  console.info(`Found ${filteredMatches.length} cup matches to process.`);
  await processMatches(filteredMatches);
  console.info("Finished processing cup matches.");
})();
