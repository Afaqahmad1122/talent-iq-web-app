import mongoose from "mongoose";
import dns from "dns";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    if (!ENV.DB_URL) {
      console.error("❌ DB_URL is not defined in environment variables");
      throw new Error("DB_URL is missing");
    }

    // Set Google DNS servers for better DNS resolution (especially for Atlas)
    const isAtlasCheck =
      ENV.DB_URL.includes("mongodb.net") ||
      ENV.DB_URL.startsWith("mongodb+srv://");

    if (isAtlasCheck) {
      // Use Google DNS for Atlas connections
      dns.setServers(["8.8.8.8", "8.8.4.4"]);
    }

    // Log connection string (without password for security)
    const dbUrlForLog = ENV.DB_URL.replace(/:[^:@]+@/, ":****@");

    // Listen to connection events BEFORE connecting
    mongoose.connection.on("error", (err) => {
      console.error("❌ Mongoose connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      // Database disconnected
    });

    mongoose.connection.on("connected", () => {
      // Mongoose connected
    });

    // Check if connection string uses mongodb:// instead of mongodb+srv://
    if (
      ENV.DB_URL.startsWith("mongodb://") &&
      ENV.DB_URL.includes("mongodb.net")
    ) {
      // Warning: Using mongodb:// format. Consider using mongodb+srv:// for Atlas
    }

    // Detect if connecting to Atlas (mongodb+srv:// or mongodb.net)
    const isAtlas =
      ENV.DB_URL.includes("mongodb.net") ||
      ENV.DB_URL.startsWith("mongodb+srv://");

    if (isAtlas) {
      // Validate connection string format for Atlas
      if (!ENV.DB_URL.startsWith("mongodb+srv://")) {
        console.error("❌ Atlas requires mongodb+srv:// format");
        throw new Error("Invalid connection string format for Atlas");
      }
    }

    // Connection options - different for Atlas vs Local
    const connectionOptions = isAtlas
      ? {
          // Atlas-specific options
          // Note: mongodb+srv:// automatically handles TLS, no need to set it
          serverSelectionTimeoutMS: 60000, // 60 seconds (increased for DNS resolution)
          socketTimeoutMS: 45000,
          connectTimeoutMS: 60000, // 60 seconds
          retryWrites: true,
          w: "majority",
          maxPoolSize: 10,
          minPoolSize: 1,
          // Retry connection on failure
          retryReads: true,
        }
      : {
          // Local MongoDB options
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 5000,
        };

    // Try connecting with retry for Atlas
    let retries = isAtlas ? 3 : 1;
    let lastError = null;

    for (let i = 0; i < retries; i++) {
      try {
        if (i > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        }
        await mongoose.connect(ENV.DB_URL, connectionOptions);
        break; // Success, exit loop
      } catch (error) {
        lastError = error;
        if (i === retries - 1) throw error; // Throw on last attempt
      }
    }
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
};
