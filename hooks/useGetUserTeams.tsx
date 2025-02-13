import { getAPI } from "@/lib/APIUtils";

export async function getTeams(clubSlug: string) {
  const response = await getAPI(`/api/teams/${clubSlug}`);
  return response.data;
}
