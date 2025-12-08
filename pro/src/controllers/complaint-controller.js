import { Complaint } from "../models/complaint.js";

import { sendNotification } from "../utills/notification-helper.js";
import User from "../models/user.module.js";

export const createTicket = async (req, res) => {
  try {
    const { category, description, images = [] } = req.body;
    if (!category || !description) {
      return res.status(400).json({ success: false, message: "Category and description are required" });
    }
    const raisedBy = req.user?._id || req.body.userId; // fallback for dev without auth
    if (!raisedBy) return res.status(401).json({ success: false, message: "Unauthorized" });

    // Fetch user to get enrollments
    const user = await User.findById(raisedBy);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let messId, hostelId;
    let recipientId;

    // Route based on category
    if (category === "food") {
      messId = user.messid;
      recipientId = messId;
      console.log(`Complaint Category: Food. Mess ID: ${messId}`);
      if (!messId) return res.status(400).json({ success: false, message: "You are not enrolled in a mess" });
    } else {
      // Default to hostel for room, plumbing, etc.
      hostelId = user.hostelid;
      recipientId = hostelId;
      console.log(`Complaint Category: ${category}. Hostel ID: ${hostelId}`);
      if (!hostelId) return res.status(400).json({ success: false, message: "You are not enrolled in a hostel" });
    }

    const doc = await Complaint.create({ raisedBy, category, description, images, messId, hostelId });

    // 🔔 Notify the owner
    if (recipientId) {
      console.log(`Sending notification to owner: ${recipientId}`);
      await sendNotification(req, recipientId, "warning", `New Complaint: ${category} - ${description.substring(0, 30)}...`, doc._id, "Complaint");
    }

    // 🔔 Notify the student (Confirmation)
    console.log(`Sending confirmation to student: ${raisedBy}`);
    await sendNotification(req, raisedBy, "success", `Complaint submitted: ${category}`, doc._id, "Complaint");

    res.json({ success: true, data: doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const myTickets = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const docs = await Complaint.find({ raisedBy: userId })
      .sort({ createdAt: -1 })
      .select("-__v -updatedAt")
      .lean();
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
