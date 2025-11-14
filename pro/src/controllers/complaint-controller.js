import { Complaint } from "../models/complaint.js";

export const createTicket = async (req, res) => {
  try {
    const { category, description, images = [] } = req.body;
    if (!category || !description) {
      return res.status(400).json({ success: false, message: "Category and description are required" });
    }
    const raisedBy = req.user?._id || req.body.userId; // fallback for dev without auth
    if (!raisedBy) return res.status(401).json({ success: false, message: "Unauthorized" });

    const doc = await Complaint.create({ raisedBy, category, description, images });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const myTickets = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const docs = await Complaint.find({ raisedBy: userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: docs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // in_progress | resolved | closed
    const doc = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const doc = await Complaint.findByIdAndUpdate(id, { feedback: { rating, comment } }, { new: true });
    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
