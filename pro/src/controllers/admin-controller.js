import { Asynchandler } from "../utills/Aynchandler.js";
import { ApiResponse } from "../utills/api-response.js";
import { apiError } from "../utills/api-error.js";
import { User, Student, Mess, Hostel } from "../models/user.module.js";
import { Complaint } from "../models/complaint.js";
import { ProfileUpdate } from "../models/profile-update.js";

// 📊 Get Dashboard Stats
export const getDashboardStats = Asynchandler(async (req, res) => {
    const totalStudents = await Student.countDocuments();
    const totalMess = await Mess.countDocuments();
    const totalHostels = await Hostel.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const activeComplaints = await Complaint.countDocuments({ status: { $in: ["pending", "in_progress"] } });

    return res.status(200).json(
        new ApiResponse(200, {
            users: { total: totalStudents + totalMess + totalHostels, students: totalStudents, mess: totalMess, hostels: totalHostels },
            complaints: { total: totalComplaints, active: activeComplaints }
        }, "Stats fetched successfully")
    );
});

// 👥 Get All Users
export const getAllUsers = Asynchandler(async (req, res) => {
    const { role } = req.query;
    let filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter).select("-password -refreshToken -accessToken").sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
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
    const complaints = await Complaint.find()
        .populate("raisedBy", "username email")
        .sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, complaints, "Complaints fetched successfully"));
});

// 📝 Get Pending Profile Updates
export const getPendingUpdates = Asynchandler(async (req, res) => {
    const updates = await ProfileUpdate.find({ status: "pending" })
        .populate("userId", "username email role")
        .sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, updates, "Pending updates fetched"));
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
