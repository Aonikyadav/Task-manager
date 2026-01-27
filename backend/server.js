import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import tasksRoutes from "./routes/tasks.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());
app.use("/api", (req, res, next) => {
  const ready = mongoose.connection && mongoose.connection.readyState === 1;
  if (!ready) {
    return res.status(503).json({ message: "Database unavailable" });
  }
  next();
});
app.use("/api/tasks", tasksRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Smart Task Flow API Server" });
});

const connect = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }
  const opts = {
    maxPoolSize: 20,
    minPoolSize: 5,
    maxIdleTimeMS: 30000,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
  };
  try {
    await mongoose.connect(uri, opts);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (e) {
    console.error("❌ MongoDB connection error:", e.message);
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
  if (!process.env.VERCEL) {
    app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
  }
});

export default app;
