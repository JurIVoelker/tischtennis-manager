import { fetchAPI } from "@/lib/APIUtils";

export async function getTeams(clubSlug: string) {
  const response = await fetchAPI(`/api/teams/${clubSlug}`);
  return response.data.data;
}
