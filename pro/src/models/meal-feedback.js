import mongoose from "mongoose";

const MealFeedbackSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        messId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The mess owner
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export const MealFeedback = mongoose.model("MealFeedback", MealFeedbackSchema);
