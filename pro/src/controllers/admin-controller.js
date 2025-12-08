import { Asynchandler } from "../utills/Aynchandler.js";
import { ApiResponse } from "../utills/api-response.js";
import { apiError } from "../utills/api-error.js";
import { User, Student, Mess, Hostel } from "../models/user.module.js";
import { Complaint } from "../models/complaint.js";
import { ProfileUpdate } from "../models/profile-update.js";
import { redisClient } from "../config/redis.js";

// 📊 Get Dashboard Stats
export const getDashboardStats = Asynchandler(async (req, res) => {
    // Redis Caching (TTL: 5 minutes)
    try {
        const cachedStats = await redisClient.get("admin_stats");
        if (cachedStats) {
            return res.status(200).json(new ApiResponse(200, JSON.parse(cachedStats), "Stats fetched successfully (Cached)"));
        }
    } catch (err) {
        console.error("Redis error:", err);
    }

    const totalStudents = await Student.countDocuments();
    const totalMess = await Mess.countDocuments();
    const totalHostels = await Hostel.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const activeComplaints = await Complaint.countDocuments({ status: { $in: ["pending", "in_progress"] } });

    const stats = {
        users: { total: totalStudents + totalMess + totalHostels, students: totalStudents, mess: totalMess, hostels: totalHostels },
        complaints: { total: totalComplaints, active: activeComplaints }
    };

    // Cache the result
    try {
        await redisClient.setEx("admin_stats", 300, JSON.stringify(stats));
    } catch (err) {
        console.error("Redis set error:", err);
    }

    return res.status(200).json(
        new ApiResponse(200, stats, "Stats fetched successfully")
    );
});

// 👥 Get All Users
export const getAllUsers = Asynchandler(async (req, res) => {
    const { role } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
        .select("-password -refreshToken -accessToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    return res.status(200).json(new ApiResponse(200, {
        users,
        page,
        totalPages,
        totalUsers
    }, "Users fetched successfully"));
});

// 🚫 Ban/Unban User
export const toggleBanUser = Asynchandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) throw new apiError(404, "User not found");

    user.isBanned = !user.isBanned;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, { isBanned: user.isBanned }, `User ${user.isBanned ? "banned" : "unbanned"} successfully`));
});

// 🗑️ Delete Complaint
export const deleteComplaint = Asynchandler(async (req, res) => {
    const { id } = req.params;
    const complaint = await Complaint.findByIdAndDelete(id);
    if (!complaint) throw new apiError(404, "Complaint not found");

    return res.status(200).json(new ApiResponse(200, {}, "Complaint deleted successfully"));
});

// 📋 Get All Complaints (Admin View)
export const getAllComplaints = Asynchandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find()
        .populate("raisedBy", "username email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalComplaints = await Complaint.countDocuments();
    const totalPages = Math.ceil(totalComplaints / limit);

    return res.status(200).json(new ApiResponse(200, {
        complaints,
        page,
        totalPages,
        totalComplaints
    }, "Complaints fetched successfully"));
});

// 📝 Get Pending Profile Updates
export const getPendingUpdates = Asynchandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const updates = await ProfileUpdate.find({ status: "pending" })
        .populate("userId", "username email role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalUpdates = await ProfileUpdate.countDocuments({ status: "pending" });
    const totalPages = Math.ceil(totalUpdates / limit);

    return res.status(200).json(new ApiResponse(200, {
        updates,
        page,
        totalPages,
        totalUpdates
    }, "Pending updates fetched"));
});

// ✅ Approve Profile Update
export const approveUpdate = Asynchandler(async (req, res) => {
    const { id } = req.params;
    const updateRequest = await ProfileUpdate.findById(id);
    if (!updateRequest) throw new apiError(404, "Update request not found");

    if (updateRequest.status !== "pending") throw new apiError(400, "Request already processed");

    // Apply updates to the actual user document
    const Model = updateRequest.role === "messowner" ? Mess : Hostel;
    const user = await Model.findById(updateRequest.userId);

    if (!user) throw new apiError(404, "User not found");

    // Apply fields
    Object.keys(updateRequest.updates).forEach(key => {
        user[key] = updateRequest.updates[key];
    });

    await user.save({ validateBeforeSave: false });

    // Update request status
    updateRequest.status = "approved";
    await updateRequest.save();

    // Notify User
    // await sendNotification(req, updateRequest.userId, "success", "Your profile update has been approved!", id, "ProfileUpdate");

    return res.status(200).json(new ApiResponse(200, {}, "Update approved and applied"));
});

// ❌ Reject Profile Update
export const rejectUpdate = Asynchandler(async (req, res) => {
    const { id } = req.params;
    const updateRequest = await ProfileUpdate.findById(id);
    if (!updateRequest) throw new apiError(404, "Update request not found");

    if (updateRequest.status !== "pending") throw new apiError(400, "Request already processed");

    updateRequest.status = "rejected";
    await updateRequest.save();

    // Notify User
    // await sendNotification(req, updateRequest.userId, "error", "Your profile update was rejected.", id, "ProfileUpdate");

    return res.status(200).json(new ApiResponse(200, {}, "Update rejected"));
});
