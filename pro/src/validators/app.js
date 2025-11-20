import { Chat, Message } from '../models/chat.js';
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import AuthRoute from '../routes/auth-route.js';
import AnnouncementRoute from '../routes/announcement-route.js';
import ComplaintRoute from '../routes/complaint-route.js';
import MenuRoute from '../routes/menu-route.js';
import StudentRoute from '../routes/student-route.js';
import MessReqRoute from '../routes/mess-requests-route.js';
import UserBasicRoute from '../routes/user-basic-route.js';
import HostelStructureRoute from '../routes/hostel-structure-route.js';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../../../public')));

// API Routes
app.use('/api', AuthRoute);
app.use('/api', AnnouncementRoute);
app.use('/api', ComplaintRoute);
app.use('/api', MenuRoute);
app.use('/api', StudentRoute);
app.use('/api', MessReqRoute);
app.use('/api', UserBasicRoute);
app.use('/api', HostelStructureRoute);

// ✅ Create HTTP server before setting up Socket.IO
export const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Handle SPA (Single Page Application) routing - Must be after all other routes
app.get(/^[^.]*$/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/index.html'));
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("🟢 Connected:", socket.id);

  socket.on("join_room", async ({ sender, receiver }) => {
    if (!sender || !receiver) return;
    const roomId = [sender, receiver].sort().join("_");
    socket.join(roomId);
    console.log(`✅ ${sender} joined room ${roomId}`);
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
