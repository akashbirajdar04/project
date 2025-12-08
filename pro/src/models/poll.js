import mongoose from "mongoose";

const PollSchema = new mongoose.Schema(
    {
        question: { type: String, required: true },
        options: [{ type: String, required: true }], // Array of option strings
        votes: {
            type: Map,
            of: Number,
            default: {},
        },
        voters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track who voted to prevent duplicates
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        scope: { type: String, enum: ["global", "hostel", "mess"], required: true },
        expiresAt: { type: Date },
    },
    { timestamps: true }
);

export const Poll = mongoose.model("Poll", PollSchema);
