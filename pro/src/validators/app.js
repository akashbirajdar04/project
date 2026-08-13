import { Chat, Message } from '../models/chat.js'
import { connectRedis } from "../config/redis.js";
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
import RoommateRoute from '../routes/roommate-route.js';
import LostFoundRoute from '../routes/lost-found-route.js';
import MealFeedbackRoute from '../routes/meal-feedback-route.js';
import PollRoute from '../routes/poll-route.js';
import RateLimiter from '../controllers/ratelimit.js';
import PaymentRoute from '../routes/payment-route.js';

const allowedOrigins = [
  "https://hosteldine-six.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.CORS_ORIGIN === "*") {
      return callback(null, origin);
    }
    // Dynamic fallback to reflect origin and allow frontend requests
    return callback(null, origin);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(RateLimiter(60, 100));

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

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
app.use('/api/v1/roommate', RoommateRoute);
app.use('/api/v1/lost-found', LostFoundRoute);
app.use('/api/v1/meal-feedback', MealFeedbackRoute);
app.use('/api/v1/meal-feedback', MealFeedbackRoute);
app.use('/api/v1', PollRoute);
app.use('/api/payment', PaymentRoute);

// ✅ Create HTTP server
export const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => callback(null, origin || "*"),
    credentials: true,
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

    // 🔔 Notify receiver (Real-time toast)
    io.to(receiver).emit("new_notification", {
      senderId: sender,
      message: message,
      createdAt: newMsg.createdAt
    });

    console.log(`💬 ${sender} → ${receiver}: ${message}`);
  });


  socket.on("disconnect", () => {
    console.log("🔴 Disconnected:", socket.id);
  });
});

// Connect to Redis
connectRedis();

// 👷 Start Background Worker
import { initWorker } from "../controllers/redisworker.js";
initWorker(io);