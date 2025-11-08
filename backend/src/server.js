import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/db.js";

const app = express();

const PORT = ENV.PORT;

// Get directory - works in both dev and production (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../..");

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.get("/books", (req, res) => {
  res.status(200).json({ message: "Books are running" });
});

// Serve static files from frontend/dist (both dev and production)
app.use(express.static(path.join(rootDir, "frontend/dist")));

// API routes should be before catch-all
// Catch-all handler: send back React app's index.html for SPA routing
app.get("{*splat}", (req, res) => {
  res.sendFile(path.join(rootDir, "frontend/dist/index.html"));
});

// Start server and connect to database
const startServer = async () => {
  // Start server first (don't wait for DB)
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Try to connect to database (non-blocking)
  try {
    console.log("🔄 Starting database connection...");
    await connectDB();
    console.log("✅ Database connection established");
  } catch (error) {
    console.warn("⚠️  Server started but database connection failed");
    console.warn("   Server will continue running without database");
    console.warn("   Error details:", error.message);
  }
};

startServer();
