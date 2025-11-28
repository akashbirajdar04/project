import mongoose from "mongoose";

const profileUpdateSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        role: {
            type: String,
            required: true,
            enum: ["messowner", "hostelowner"]
        },
        updates: {
            type: Object,
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },
        adminComment: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

export const ProfileUpdate = mongoose.model("ProfileUpdate", profileUpdateSchema);
