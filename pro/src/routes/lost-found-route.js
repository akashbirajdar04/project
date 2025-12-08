import express from "express";
import { LostFoundItem } from "../models/lost-found-item.js";
import { validateLostFoundItem } from "../validators/lost-found-validators.js";
import { validateObjectId } from "../validators/common-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

const router = express.Router();

// Post an item
router.post("/create", validateLostFoundItem, validateuser, async (req, res) => {
    try {
        const newItem = await LostFoundItem.create(req.body);
        res.status(201).json({ success: true, data: newItem });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get items by hostel
router.get("/hostel/:hostelId", validateObjectId("hostelId"), validateuser, async (req, res) => {
    try {
        const items = await LostFoundItem.find({ hostelId: req.params.hostelId })
            .sort({ createdAt: -1 })
            .populate("userId", "username");
        res.status(200).json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Mark as resolved
router.put("/resolve/:id", validateObjectId("id"), validateuser, async (req, res) => {
    try {
        const item = await LostFoundItem.findByIdAndUpdate(req.params.id, { status: "Resolved" }, { new: true });
        res.status(200).json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
