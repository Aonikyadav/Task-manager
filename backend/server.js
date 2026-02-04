import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import tasksRoutes from "./routes/tasks.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:8080",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    database: dbStatus,
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Smart Task Flow API Server",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      tasks: "/api/tasks",
    },
  });
});

// Database connection check middleware
app.use("/api", (req, res, next) => {
  const ready = mongoose.connection && mongoose.connection.readyState === 1;
  if (!ready) {
    return res.status(503).json({ message: "Database unavailable" });
  }
  next();
});

// Routes
app.use("/api/tasks", tasksRoutes);
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

const connect = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI is not set");
    process.exit(1);
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "dev-secret") {
    console.warn("⚠️  Warning: Using default JWT_SECRET. Change this in production!");
  }

  const opts = {
    maxPoolSize: 20,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  };

  try {
    await mongoose.connect(uri, opts);
    console.log("✅ Connected to MongoDB");
    
    // Handle connection events
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("✅ MongoDB reconnected");
    });
  } catch (e) {
    console.error("❌ MongoDB connection error:", e.message);
    process.exit(1);
  }
};

connect().then(() => {
  if (process.env.CLEAR_DB === "true") {
    (async () => {
      try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        for (const c of collections) {
          await db.collection(c.name).deleteMany({});
        }
        console.log("DB cleared");
      } catch (e) {
        console.error("clear-db-error:", e.message);
      }
    })();
  }
  // Only start server if not on Vercel (Vercel handles it automatically)
  if (!process.env.VERCEL && !process.env.RENDER) {
    app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
  }
});

// Export for Vercel serverless
export default app;
