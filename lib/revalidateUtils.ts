import { revalidatePath } from "next/cache";

export const revalidatePaths = (pathsToRevalidate: string[]) => {
  pathsToRevalidate.forEach((path) => {
    revalidatePath(path);
  });
};
