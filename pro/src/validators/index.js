import dotenv from "dotenv";
import path from "path";
import { connectDb } from "../db/index.js";
import {  server } from "./app.js"; // import the same HTTP+Socket server

dotenv.config({ path: path.resolve("./.env") });

connectDb()
  .then(() => {
    server.listen(3000, () => {
      console.log("🚀 Server running on port 3000 with Socket.IO");
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err.message);
  });
