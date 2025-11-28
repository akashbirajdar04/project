import { Chat, Message } from '../models/chat.js'
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import AuthRoute from '../routes/auth-route.js';
import AnnouncementRoute from '../routes/announcement-route.js';
import ComplaintRoute from '../routes/complaint-route.js';
import MenuRoute from '../routes/menu-route.js';
import StudentRoute from '../routes/student-route.js';
import MessReqRoute from '../routes/mess-requests-route.js';
import UserBasicRoute from '../routes/user-basic-route.js';
import HostelStructureRoute from '../routes/hostel-structure-route.js';
import UploadRoute from '../routes/upload-route.js';
import AdminRoute from '../routes/admin-route.js'; // 🛡️ Admin Route

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', AuthRoute)
app.use('/', AnnouncementRoute)
app.use('/', ComplaintRoute)
app.use('/', MenuRoute)
app.use('/', StudentRoute)
app.use('/', MessReqRoute)
app.use('/', UserBasicRoute)
app.use('/', HostelStructureRoute)
app.use('/', UploadRoute)
app.use('/api/v1/admin', AdminRoute) // 🛡️ Admin Routes

// ✅ Create HTTP server
export const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io); // ✅ Make io accessible in controllers


io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("join_room", async ({ sender, receiver }) => {
    if (!sender || !receiver) return;
    const roomId = [sender, receiver].sort().join("_");
    socket.join(roomId);
    console.log(`✅ ${sender} joined room ${roomId}`);
  });

  // 🔔 Join user's personal room for notifications
  socket.on("register_user", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`👤 User ${userId} registered for notifications`);
    }
  });

  socket.on("send_message", async (data) => {
    const { sender, receiver, message } = data;
    const roomId = [sender, receiver].sort().join("_");

    // 1️⃣ Find or create a chat
    let chat = await Chat.findOne({ participants: { $all: [sender, receiver] } });
    if (!chat) chat = await Chat.create({ participants: [sender, receiver] });

    // 2️⃣ Save the message
    const newMsg = await Message.create({
      chatId: chat._id,
      sender,
      receiver,
      message,
    });

    // 3️⃣ Update lastMessage
    chat.lastMessage = newMsg._id;
    await chat.save();

    // 4️⃣ Emit the message to both users
    io.to(roomId).emit("receive_message", newMsg);

    console.log(`💬 ${sender} → ${receiver}: ${message}`);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});
