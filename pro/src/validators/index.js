
console.error("========================================");
console.error("!!! PRO APP RELOADING AT " + new Date().toISOString());
console.error("========================================");
import dotenv from "dotenv";
import path from "path";
import { connectDb } from "../db/index.js";
import { server } from "./app.js"; // import the same HTTP+Socket server

dotenv.config({ path: path.resolve("./.env") });


const PORT = process.env.PORT || 3000;

connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} with Socket.IO`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect DB:", err.message);
  });

export default server;

