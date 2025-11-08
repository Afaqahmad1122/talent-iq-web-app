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
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  INNJEST_EVENT_KEY: process.env.INNJEST_EVENT_KEY,
  INNJEST_SIGNING_KEY: process.env.INNJEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
};
