import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbFilePath = path.join(__dirname, "../prisma/db/database.db");

if (fs.existsSync(dbFilePath)) {
  console.log("database.db already exists, skipping creation");
} else {
  fs.writeFileSync(dbFilePath, "");
  console.log("database.db file created successfully");
}
