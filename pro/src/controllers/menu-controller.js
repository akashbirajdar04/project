import { Menu } from "../models/menu.js";
import { Booking } from "../models/booking.js";
import { sendNotification } from "../utills/notification-helper.js";

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const slots = ["breakfast", "lunch", "dinner"];

export const getWeekMenu = async (req, res) => {
  try {
    console.log("Fetching week menu...");
    let messId;

    // Determine messId based on user role
    if (req.user.role === 'student') {
      messId = req.user.messid;
      console.log(`Student ${req.user._id} fetching menu for mess: ${messId}`);
      if (!messId) return res.json({ success: true, data: {} }); // Not enrolled
    } else if (req.user.role === 'messowner') {
      messId = req.user._id;
    } else {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const docs = await Menu.find({ messId }).lean();
    console.log(`Found ${docs.length} menu entries for mess ${messId}`);

    // normalize to map day->slot
    const map = {};
    for (const d of days) {
      map[d] = {};
      for (const s of slots) map[d][s] = { items: [], capacity: 100 };
    }
    for (const m of docs) {
      if (map[m.day] && map[m.day][m.slot]) {
        map[m.day][m.slot] = { items: m.items, capacity: m.capacity, _id: m._id };
      }
    }
    res.json({ success: true, data: map });
  } catch (e) {
    console.error("Error fetching menu:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const setMenu = async (req, res) => {
  try {
    const { day, slot, items = [], capacity = 100 } = req.body;
    const messId = req.user._id; // Owner ID is the messId

    console.log(`Setting menu for ${day} ${slot}: ${items.length} items`);
    if (!days.includes(day) || !slots.includes(slot)) return res.status(400).json({ success: false, message: "Invalid day/slot" });

    const doc = await Menu.findOneAndUpdate(
      { day, slot, messId },
      { day, slot, items, capacity, messId },
      { upsert: true, new: true }
    );
    console.log("Menu saved:", doc._id);

    // 🔔 Notify enrolled students
    if (req.user && req.user.accepted && req.user.accepted.length > 0) {
      const message = `Menu updated for ${day.toUpperCase()} ${slot.toUpperCase()}`;
      for (const studentId of req.user.accepted) {
        sendNotification(req, studentId, "info", message, doc._id, "Menu");
      }
    }

    // 🔔 Also notify the owner (Real-time sync for their own UI)
    const io = req.app.get("io");
    if (io) {
      io.to(req.user._id.toString()).emit("receive_notification", {
        type: "success",
        message: "Menu updated",
        relatedModel: "Menu",
        relatedId: doc._id
      });
    }

    res.json({ success: true, data: doc });
  } catch (e) {
    console.error("Error setting menu:", e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getCapacity = async (req, res) => {
  try {
    const { day, slot } = req.query;
    // Assume student is asking, so use their messId
    // If we want to support public view, we need messId in query
    // For now, let's assume authenticated student
    if (!req.user || !req.user.messid) {
      return res.status(400).json({ success: false, message: "Enrollment required" });
    }
    const messId = req.user.messid;

    const menu = await Menu.findOne({ day, slot, messId });
    if (!menu) return res.json({ success: true, data: { remaining: 0, total: 0 } });

    const count = await Booking.countDocuments({ day, slot, messId });
    // Wait, Booking schema doesn't have messId? It should probably link to the menu or mess.
    // But for now, let's assume Booking is global? No, that would be bad.
    // Let's check Booking model.

    // Assuming Booking has userId, we can find the user's mess? 
    // Or Booking should have messId.
    // Let's check Booking model in next step. For now, fixing import.

    res.json({ success: true, data: { remaining: Math.max(menu.capacity - count, 0), total: menu.capacity } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const bookMeal = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { day, slot } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!days.includes(day) || !slots.includes(slot)) return res.status(400).json({ success: false, message: "Invalid day/slot" });

    if (!req.user.messid) return res.status(400).json({ success: false, message: "Not enrolled in any mess" });
    const messId = req.user.messid;

    const menu = await Menu.findOne({ day, slot, messId });
    if (!menu) return res.status(400).json({ success: false, message: "Menu not set" });

    // Check capacity - need to filter bookings by mess/menu?
    // If Booking doesn't have messId, we might count bookings from other messes!
    const count = await Booking.countDocuments({ day, slot, messId });

    if (count >= menu.capacity) return res.status(409).json({ success: false, message: "Capacity full" });

    const doc = await Booking.create({ userId, day, slot, messId });
    res.json({ success: true, data: doc });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ success: false, message: "Already booked" });
    res.status(500).json({ success: false, message: e.message });
  }
};

export const myBookings = async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;
    const docs = await Booking.find({ userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: docs });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
