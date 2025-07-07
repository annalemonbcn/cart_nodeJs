import mongoose from "mongoose";
import "dotenv-flow/config";

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.MONGO_DB_NAME;

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

const disconnectFromDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ Disconnected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB disconnection error:", error.message);
    process.exit(1);
  }
};

export { connectToDatabase, disconnectFromDatabase };
