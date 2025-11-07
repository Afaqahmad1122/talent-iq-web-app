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

// make ready for deployment

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, ",,.frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
