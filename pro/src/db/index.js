import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - resolve path relative to project root (pro folder)
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

export const connectDb = async () => {
  try {
    // Use environment variable (DB or MONGODB_URI) or fallback to default connection string
    const mongoUri = process.env.DB || process.env.MONGODB_URI || "mongodb+srv://akash:akash95189@cluster0.sy7yobp.mongodb.net/mydb";
    
    // Debug: Log if using env var or fallback (without showing password)
    if (process.env.DB || process.env.MONGODB_URI) {
      console.log("📝 Using MongoDB connection string from .env file");
    } else {
      console.log("⚠️  Using fallback connection string (DB or MONGODB_URI not found in .env)");
    }
    
    // Remove deprecated options - they're no longer needed in mongoose 6+
    await mongoose.connect(mongoUri);
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("❌ DB cannot connect:", error.message);
    console.error("💡 Tips to fix:");
    console.error("   1. Check your MongoDB credentials in .env file");
    console.error("   2. Make sure your IP is whitelisted in MongoDB Atlas");
    console.error("   3. Verify the database name is correct");
    console.error("   4. Check if your MongoDB cluster is running");
    console.error(`   5. .env file path: ${envPath}`);
    process.exit(1); // exit process if db fails
  }
};
