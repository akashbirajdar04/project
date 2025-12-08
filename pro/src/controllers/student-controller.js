import User, { Student, Mess } from "../models/user.module.js";
import mongoose from "mongoose";
import { redisClient } from "../config/redis.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const doc = await Student.findById(userIdObj)
      .select("-password -refreshToken -accessToken -__v -updatedAt")
      .lean();
    if (!doc) return res.status(404).json({ success: false, message: "Student not found" });
    console.log("Fetched Profile for:", userId, "Avatar:", doc.avatar);
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getEnrolledMess = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    const userIdObj = new mongoose.Types.ObjectId(userId);
    const mess = await Mess.findOne({ accepted: userIdObj }).select("_id name adress price email").lean();
    return res.json({ success: true, data: mess || null });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

import { uploadBufferToCloudinary } from "../utills/cloudinary.js";

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    let updates = { ...req.body };

    // Handle file upload
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer);
      updates.avatar = {
        url: result.secure_url,
        public_id: result.public_id
      };
    }

    // Parse JSON fields if they are strings (FormData sends everything as strings)
    const jsonFields = ["preferences", "guardian", "health", "emergency"];
    for (const field of jsonFields) {
      if (typeof updates[field] === "string") {
        try {
          updates[field] = JSON.parse(updates[field]);
        } catch (e) {
          console.error(`Failed to parse ${field}:`, e);
        }
      }
    }

    const payload = (({ course, year, preferences, guardian, health, allergies, emergency, avatar, isLookingForRoommate, contact }) => ({ course, year, preferences, guardian, health, allergies, emergency, avatar, isLookingForRoommate, contact }))(updates);

    // Remove undefined fields to avoid overwriting with null/undefined
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

    console.log("Updating profile for user:", userId);
    console.log("Update Payload:", JSON.stringify(payload, null, 2));

    const doc = await Student.findByIdAndUpdate(userId, { $set: payload }, { new: true });
    console.log("Updated Document:", JSON.stringify(doc, null, 2));

    // Invalidate cache if roommate status changed
    if (payload.isLookingForRoommate !== undefined) {
      try {
        await redisClient.incr("looking_students_version");
      } catch (err) {
        console.error("Redis error:", err);
      }
    }

    res.json({ success: true, data: doc });
  } catch (e) {
    console.error("Update profile error:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getLookingStudents = async (req, res) => {
  console.time("getLookingStudents");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = (req.query.search || "").trim();
    const skip = (page - 1) * limit;

    const filter = { isLookingForRoommate: true };

    if (search) {
      const regex = { $regex: search, $options: "i" };
      filter.$or = [
        { username: regex },
        { course: regex },
        { year: regex }
      ];
    }

    // Redis Caching
    let version = "1";
    try {
      version = await redisClient.get("looking_students_version") || "1";
      const cacheKey = `looking_students:v:${version}:p:${page}:l:${limit}:s:${search}`;
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.timeEnd("getLookingStudents");
        return res.status(200).json(JSON.parse(cachedData));
      }
    } catch (err) {
      console.error("Redis error:", err);
    }

    const students = await Student.find(filter)
      .select("username course year preferences contact avatar")
      .skip(skip)
      .limit(limit)
      .lean();

    const totalStudents = await Student.countDocuments(filter);
    const totalPages = Math.ceil(totalStudents / limit);

    const responseData = {
      success: true,
      data: students,
      page,
      totalPages,
      totalStudents
    };

    // Cache the result
    try {
      const version = await redisClient.get("looking_students_version") || "1";
      const cacheKey = `looking_students:v:${version}:p:${page}:l:${limit}:s:${search}`;
      await redisClient.setEx(cacheKey, 300, JSON.stringify(responseData));
    } catch (err) {
      console.error("Redis set error:", err);
    }

    console.timeEnd("getLookingStudents");
    res.status(200).json(responseData);
  } catch (error) {
    console.timeEnd("getLookingStudents");
    console.error("Error fetching looking students:", error);
    res.status(500).json({ success: false, message: "Failed to fetch students" });
  }
};
