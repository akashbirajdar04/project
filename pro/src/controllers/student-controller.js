import User, { Student, Mess } from "../models/user.module.js";

export const getProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const doc = await Student.findById(userId).lean();
    if (!doc) return res.status(404).json({ success: false, message: "Student not found" });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getEnrolledMess = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });
    const mess = await Mess.findOne({ accepted: userId }).select("_id name adress price email").lean();
    return res.json({ success: true, data: mess || null });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    const payload = (({ course, year, preferences, guardian, health, allergies, emergency }) => ({ course, year, preferences, guardian, health, allergies, emergency }))(req.body);
    const doc = await Student.findByIdAndUpdate(userId, { $set: payload }, { new: true });
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
