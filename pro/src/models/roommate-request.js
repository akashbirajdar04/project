import mongoose from "mongoose";

const RoommateRequestSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        preferences: { type: String, required: true }, // e.g., "Non-smoker, quiet, early riser"
        gender: { type: String, enum: ["Male", "Female", "Any"], default: "Any" },
        status: { type: String, enum: ["Open", "Closed"], default: "Open" },
        contactInfo: { type: String, required: true }, // Phone or Email
    },
    { timestamps: true }
);

export const RoommateRequest = mongoose.model("RoommateRequest", RoommateRequestSchema);
