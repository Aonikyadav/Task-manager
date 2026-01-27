import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const uri = process.env.MONGODB_URI;

async function run() {
  if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { family: 4 });
    const db = mongoose.connection.db;
    const name = db.databaseName;
    const collections = await db.listCollections().toArray();
    for (const c of collections) {
      await db.collection(c.name).deleteMany({});
    }
    console.log(JSON.stringify({ database: name, clearedCollections: collections.map(c => c.name) }));
  } catch (e) {
    console.error("clear-db-error:", e.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

run();
