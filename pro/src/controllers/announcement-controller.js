import { Announcement } from "../models/announcement.js";

export const createAnnouncement = async (req, res) => {
  try {
    const { title, body, scope = "global", tags = [] } = req.body;
    if (!title || !body) return res.status(400).json({ success: false, message: "Title and body are required" });

    const doc = await Announcement.create({ title, body, scope, tags, createdBy: req.user?._id });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listAnnouncements = async (req, res) => {
  try {
    const { scope, q } = req.query;
    const filter = {};
    if (scope) filter.scope = scope;
    if (q) filter.$or = [ { title: { $regex: q, $options: "i" } }, { body: { $regex: q, $options: "i" } } ];

    const docs = await Announcement.find(filter).sort({ createdAt: -1 }).limit(200);
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
