import User from "../models/user.module.js";

export const getUsersBasic = async (req, res) => {
  try {
    let { ids } = req.query; // comma-separated or repeated query params
    if (!ids) return res.json({ success: true, data: [] });
    if (typeof ids === "string") ids = ids.split(",").filter(Boolean);

    const docs = await User.find({ _id: { $in: ids } })
      .select("_id username email role")
      .lean();
    res.json({ success: true, data: docs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
