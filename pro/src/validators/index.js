import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDb } from "../db/index.js";
import {  server } from "./app.js"; // import the same HTTP+Socket server

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables - resolve path relative to project root (pro folder)
const envPath = path.resolve(__dirname, "../../.env");
dotenv.config({ path: envPath });

connectDb()
  .then(() => {
    server.listen(3000, () => {
      console.log("🚀 Server running on port 3000 with Socket.IO");
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err.message);
  });
