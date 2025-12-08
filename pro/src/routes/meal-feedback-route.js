import express from "express";
import { MealFeedback } from "../models/meal-feedback.js";
import { validateMealFeedbackSubmission } from "../validators/request-validators.js";
import { validateObjectId } from "../validators/common-validators.js";
import { validateuser } from "../middleware/validate.middle.js";

const router = express.Router();

// Submit feedback
router.post("/submit", validateMealFeedbackSubmission, validateuser, async (req, res) => {
    try {
        const feedback = await MealFeedback.create(req.body);
        res.status(201).json({ success: true, data: feedback });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get feedback for a mess
router.get("/mess/:messId", validateObjectId("messId"), validateuser, async (req, res) => {
    try {
        const feedbacks = await MealFeedback.find({ messId: req.params.messId }).populate("userId", "username");
        res.status(200).json({ success: true, data: feedbacks });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;
