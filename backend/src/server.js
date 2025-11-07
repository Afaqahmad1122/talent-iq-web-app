import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";

const app = express();

const PORT = ENV.PORT;

const __dirname = path.resolve();

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

app.get("/books", (req, res) => {
  res.status(200).json({ message: "Books are running" });
});

// Serve static files from frontend/dist (both dev and production)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API routes should be before catch-all
// Catch-all handler: send back React app's index.html for SPA routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
