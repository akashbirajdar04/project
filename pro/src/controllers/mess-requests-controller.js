import { Mess, Student } from "../models/user.module.js";
import { sendNotification } from "../utills/notification-helper.js";
import mongoose from "mongoose";
import { redisClient } from "../config/redis.js";
import { Chat, Message } from "../models/chat.js";
export const acceptMessRequest = async (req, res) => {
  try {
    const { messId } = req.params;
    const { userId } = req.body;
    console.log('AcceptMessRequest called with messId:', messId, 'userId:', userId);
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    const messIdObj = new mongoose.Types.ObjectId(messId);
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const mess = await Mess.findById(messIdObj);
    if (!mess) return res.status(404).json({ success: false, message: "Mess not found" });

    // remove from requesters if present
    mess.requesters = (mess.requesters || []).filter((id) => String(id) !== String(userId));

    // remove from accepted if present (to force payment flow even if previously accepted)
    mess.accepted = (mess.accepted || []).filter((id) => String(id) !== String(userId));

    // add to payment_pending using Mongoose addToSet (handles duplicates and initialization)
    if (!mess.payment_pending) mess.payment_pending = [];
    mess.payment_pending.addToSet(userIdObj);

    await mess.save({ validateBeforeSave: false });
    console.log(`User ${userId} moved to payment_pending for Mess ${messId}`);

    // NOTE: Do NOT update student's messid yet. Wait for payment.

    // Invalidate cache immediately after DB update
    try {
      await redisClient.incr(`mess_version_${messId}`);
    } catch (err) {
      console.error("Redis error:", err);
    }

    // 🔔 Send Notification
    try {
      await sendNotification(req, userId, "success", `Your request to join ${mess.name || 'the mess'} has been accepted!`, messId, "Mess");
    } catch (notifyErr) {
      console.error("Notification error:", notifyErr);
    }

    res.json({ success: true, data: { requesters: mess.requesters, accepted: mess.accepted } });
  } catch (e) {
    console.error('Error accepting mess request:', e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getMessAccepted = async (req, res) => {
  console.time("getMessAccepted");
  try {
    const { messId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = (req.query.search || "").trim();
    const skip = (page - 1) * limit;

    // Redis Caching
    let version = "1";
    try {
      version = await redisClient.get(`mess_version_${messId}`);
      if (!version) {
        version = "1";
        await redisClient.set(`mess_version_${messId}`, version);
      }
      const cacheKey = `mess_accepted:${messId}:v:${version}:p:${page}:l:${limit}:s:${search}`;
      console.log(`[Redis] Checking cache: ${cacheKey}`);

      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`[Redis] Cache HIT for ${cacheKey}`);
        console.timeEnd("getMessAccepted");
        return res.status(200).json(JSON.parse(cachedData));
      }
      console.log(`[Redis] Cache MISS for ${cacheKey}`);
    } catch (err) {
      console.error("Redis error:", err);
    }

    const messIdObj = new mongoose.Types.ObjectId(messId);

    // Build query
    const query = { messid: messIdObj };

    if (search) {
      const regex = { $regex: search, $options: "i" };
      const searchConditions = [
        { username: regex },
        { email: regex }
      ];

      if (mongoose.Types.ObjectId.isValid(search)) {
        searchConditions.push({ _id: search });
      }

      query.$or = searchConditions;
    }

    // Optimized: Query Student collection directly
    const students = await Student.find(query)
      .skip(skip)
      .limit(limit)
      .select("username email role avatar contact course year")
      .lean();

    const totalStudents = await Student.countDocuments(query);
    const totalPages = Math.ceil(totalStudents / limit);

    const responseData = {
      success: true,
      data: students,
      page,
      totalPages,
      totalStudents
    };

    // Cache the result (TTL 300 seconds)
    try {
      const version = await redisClient.get(`mess_version_${messId}`) || "1";
      const cacheKey = `mess_accepted:${messId}:v:${version}:p:${page}:l:${limit}:s:${search}`;
      await redisClient.setEx(cacheKey, 300, JSON.stringify(responseData));
    } catch (err) {
      console.error("Redis set error:", err);
    }

    console.timeEnd("getMessAccepted");
    res.status(200).json(responseData);
  } catch (error) {
    console.timeEnd("getMessAccepted");
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const removeMessAccepted = async (req, res) => {
  try {
    const { messId, userId } = req.params;
    const messIdObj = new mongoose.Types.ObjectId(messId);
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const mess = await Mess.findById(messIdObj);
    if (!mess) return res.status(404).json({ success: false, message: 'Mess not found' });

    // Remove from mess accepted list
    mess.accepted = (mess.accepted || []).filter((id) => String(id) !== String(userId));
    await mess.save({ validateBeforeSave: false });

    // Update student's messid (remove it)
    await Student.findByIdAndUpdate(userIdObj, { $unset: { messid: "" } });

    // Invalidate cache immediately after DB update
    try {
      const newVersion = await redisClient.incr(`mess_version_${messId}`);
      console.log(`[Redis] Incremented version for ${messId} to ${newVersion}`);
    } catch (err) {
      console.error("Redis error:", err);
    }

    // 🔔 Send Notification (Non-blocking)
    sendNotification(req, userId, "warning", `You have been removed from ${mess.name || 'the mess'}.`, messId, "Mess")
      .catch(err => console.error("Notification error:", err));

    res.json({ success: true, data: mess.accepted });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const rejectMessRequest = async (req, res) => {
  try {
    const { messId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    const messIdObj = new mongoose.Types.ObjectId(messId);
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const mess = await Mess.findById(messIdObj);
    if (!mess) return res.status(404).json({ success: false, message: "Mess not found" });

    // remove from requesters
    mess.requesters = (mess.requesters || []).filter((id) => String(id) !== String(userId));
    await mess.save({ validateBeforeSave: false });

    // 🔔 Send Notification
    await sendNotification(req, userId, "error", `Your request to join ${mess.name || 'the mess'} has been rejected.`, messId, "Mess");

    res.json({ success: true, data: { requesters: mess.requesters, accepted: mess.accepted } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getMessMsgList = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("getMessMsgList hit with ID:", id);
    const { name } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const mess = await Mess.findById(id).select("accepted");
    if (!mess) return res.status(404).json({ message: "Mess not found" });

    let targetIds = mess.accepted.map(id => id.toString());

    // 2. If searching, filter IDs first
    if (name && name.trim() !== "") {
      const regex = new RegExp(name, "i");
      const searchConditions = [{ name: regex }, { username: regex }];
      if (mongoose.Types.ObjectId.isValid(name)) {
        searchConditions.push({ _id: name });
      }

      const matchingStudents = await Student.find({
        _id: { $in: targetIds },
        $or: searchConditions
      }).select("_id");

      targetIds = matchingStudents.map(s => s._id.toString());
    }

    // 3. Fetch Chats sorted by last message
    const chats = await Chat.find({ participants: id })
      .sort({ updatedAt: -1 })
      .select("participants updatedAt");

    const chatStudentIds = [];
    chats.forEach(chat => {
      const studentId = chat.participants.find(p => p.toString() !== id.toString());
      if (studentId) chatStudentIds.push(studentId.toString());
    });

    // 4. Merge Lists
    const sortedIds = [...new Set([...chatStudentIds, ...targetIds])];
    const finalIds = sortedIds.filter(sid => targetIds.includes(sid));

    // 5. Paginate IDs
    const pagedIds = finalIds.slice(skip, skip + limit);

    // 6. Fetch Student Details
    const students = await Student.find({ _id: { $in: pagedIds } })
      .select("name username avatar email")
      .lean();

    // 7. Re-sort students
    const studentsMap = new Map(students.map(s => [s._id.toString(), s]));
    const orderedStudents = pagedIds.map(id => studentsMap.get(id)).filter(Boolean);

    // 8. Attach Unread Count & Last Message Time
    const studentsWithStats = await Promise.all(orderedStudents.map(async (student) => {
      const chat = await Chat.findOne({ participants: { $all: [id, student._id] } });
      let unreadCount = 0;
      let lastMessageTime = null;

      if (chat) {
        unreadCount = await Message.countDocuments({
          chatId: chat._id,
          receiver: id,
          status: { $ne: "read" }
        });
        lastMessageTime = chat.updatedAt;
      }

      return {
        ...student,
        unreadCount,
        lastMessageTime
      };
    }));

    const total = finalIds.length;

    return res.status(200).json({
      data: studentsWithStats,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching mess message list:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const confirmMessPayment = async (req, res) => {
  try {
    const { messId } = req.params;
    const { userId } = req.body;

    const messIdObj = new mongoose.Types.ObjectId(messId);
    const userIdObj = new mongoose.Types.ObjectId(userId);

    const mess = await Mess.findById(messIdObj);
    if (!mess) return res.status(404).json({ success: false, message: "Mess not found" });

    // Remove from payment_pending
    mess.payment_pending = (mess.payment_pending || []).filter((id) => String(id) !== String(userId));

    // Add to accepted
    if (!mess.accepted?.some((id) => String(id) === String(userId))) {
      mess.accepted = [...(mess.accepted || []), userIdObj];
    }
    await mess.save({ validateBeforeSave: false });

    // Update student's messid
    const student = await Student.findById(userIdObj);
    if (student) {
      student.messid = messIdObj;
      await student.save({ validateBeforeSave: false });
    }

    // Invalidate cache
    try {
      await redisClient.incr(`mess_version_${messId}`);
    } catch (err) {
      console.error("Redis error:", err);
    }

    // Notify
    await sendNotification(req, userId, "success", `Payment received! You are now enrolled in ${mess.name}.`, messId, "Mess");

    res.json({ success: true, message: "Payment confirmed, enrollment complete." });
  } catch (e) {
    console.error("Error confirming mess payment:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};
