import { revalidatePath } from "next/cache";

export const revalidateAfterVote = (
  clubSlug: string,
  teamSlug: string,
  matchId: string
) => {
  const pathsToRevalidate = [
    `/${clubSlug}/${teamSlug}`,
    `/${clubSlug}/${teamSlug}/spiel/aufstellung/verwalten/${matchId}`,
  ];
  pathsToRevalidate.forEach((path) => {
    revalidatePath(path);
  });
};
