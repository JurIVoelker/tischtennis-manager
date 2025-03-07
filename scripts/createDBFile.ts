import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbFilePath = path.join(__dirname, "../prisma/database.db");

if (fs.existsSync(dbFilePath)) {
  throw new Error("database.db already exists");
} else {
  fs.writeFileSync(dbFilePath, "");
  console.log("database.db file created successfully");
}
