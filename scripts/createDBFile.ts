import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbFilePath = path.join(__dirname, "../prisma/db/database.db");

if (fs.existsSync(dbFilePath)) {
  console.info("database.db already exists, skipping creation");
} else {
  const dbDirPath = path.dirname(dbFilePath);
  if (!fs.existsSync(dbDirPath)) {
    fs.mkdirSync(dbDirPath, { recursive: true });
  }
  fs.writeFileSync(dbFilePath, "");
  console.info("database.db file created successfully");
}
