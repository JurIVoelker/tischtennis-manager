import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const clubSlug = process.env.CLUB_SLUG;

const schema = z.object({
  clubSlug: z.string().nonempty(),
});

const schemaValid = schema.safeParse({ clubSlug });

if (!schemaValid.success) {
  throw new Error(
    "Invalid environment variables: " + JSON.stringify(schemaValid.error.errors)
  );
}

const setSlugInManifest = async () => {
  const manifestPath = path.resolve(__dirname, "../public/manifest.json");
  let manifest = await fs.readFile(manifestPath, "utf-8");
  manifest = manifest.replace("[clubSlug]", clubSlug || "");
  await fs.writeFile(manifestPath, manifest);
};

setSlugInManifest();
