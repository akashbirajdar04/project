import express from "express";
import { RoommateRequest } from "../models/roommate-request.js";

import { validateRoommateRequest } from "../validators/request-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

import { validateObjectId } from "../validators/common-validators.js";

const router = express.Router();

// Create a request
router.post("/create", validateRoommateRequest, validateuser, async (req, res) => {
    try {
        console.log("Creating roommate request:", req.body);
        const newRequest = await RoommateRequest.create(req.body);
        res.status(201).json({ success: true, data: newRequest });
    } catch (err) {
        console.error("Error creating roommate request:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get all open requests
router.get("/all", async (req, res) => {
    try {
        const requests = await RoommateRequest.find({ status: "Open" }).populate("userId", "username email avatar");
        res.status(200).json({ success: true, data: requests });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Update a request
router.put("/:id", validateObjectId("id"), validateRoommateRequest, validateuser, async (req, res) => {
    try {
        const updatedRequest = await RoommateRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json({ success: true, data: updatedRequest });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Delete a request
router.delete("/:id", validateObjectId("id"), async (req, res) => {
    try {
        await RoommateRequest.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Request deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
