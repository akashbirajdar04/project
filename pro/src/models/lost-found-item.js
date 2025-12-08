import mongoose from "mongoose";

const LostFoundItemSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The hostel owner
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String }, // URL to image
        type: { type: String, enum: ["Lost", "Found"], required: true },
        location: { type: String }, // Where it was lost/found
        status: { type: String, enum: ["Active", "Resolved"], default: "Active" },
        contactInfo: { type: String, required: true },
    },
    { timestamps: true }
);

export const LostFoundItem = mongoose.model("LostFoundItem", LostFoundItemSchema);
