import axios from "axios";

export async function getTeams(clubSlug: string) {
  const response = await axios.get(`/api/teams/${clubSlug}`);
  return response.data.data;
}
