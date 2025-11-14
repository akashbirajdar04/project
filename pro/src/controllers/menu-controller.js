import { Menu } from "../models/menu.js";
import { Booking } from "../models/booking.js";

const days = ["mon","tue","wed","thu","fri","sat","sun"];
const slots = ["breakfast","lunch","dinner"];

export const getWeekMenu = async (_req, res) => {
  try {
    const docs = await Menu.find({}).lean();
    // normalize to map day->slot
    const map = {};
    for (const d of days) {
      map[d] = {};
      for (const s of slots) map[d][s] = { items: [], capacity: 100 };
    }
    for (const m of docs) map[m.day][m.slot] = { items: m.items, capacity: m.capacity, _id: m._id };
    res.json({ success: true, data: map });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const setMenu = async (req, res) => {
  try {
    const { day, slot, items = [], capacity = 100 } = req.body;
    if (!days.includes(day) || !slots.includes(slot)) return res.status(400).json({ success: false, message: "Invalid day/slot" });
    const doc = await Menu.findOneAndUpdate(
      { day, slot },
      { day, slot, items, capacity },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: doc });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getCapacity = async (req, res) => {
  try {
    const { day, slot } = req.query;
    const menu = await Menu.findOne({ day, slot });
    if (!menu) return res.json({ success: true, data: { remaining: 0, total: 0 } });
    const count = await Booking.countDocuments({ day, slot });
    res.json({ success: true, data: { remaining: Math.max(menu.capacity - count, 0), total: menu.capacity } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const bookMeal = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { day, slot } = req.body;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!days.includes(day) || !slots.includes(slot)) return res.status(400).json({ success: false, message: "Invalid day/slot" });

    const menu = await Menu.findOne({ day, slot });
    if (!menu) return res.status(400).json({ success: false, message: "Menu not set" });
    const count = await Booking.countDocuments({ day, slot });
    if (count >= menu.capacity) return res.status(409).json({ success: false, message: "Capacity full" });

    const doc = await Booking.create({ userId, day, slot });
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
