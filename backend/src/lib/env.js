import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 8080,
  DB_URL: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV || "production",
};
