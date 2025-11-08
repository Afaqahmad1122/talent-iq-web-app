import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get directory path for .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: envPath, quiet: true });

export const ENV = {
  PORT: process.env.PORT || 8080,
  DB_URL: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV || "production",
};
