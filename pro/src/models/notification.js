import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["info", "success", "error", "warning"],
            default: "info",
        },
        message: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        relatedId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'onModel'
        },
        onModel: {
            type: String,
            enum: ['User', 'Complaint'] // Dynamic reference if needed
        }
    },
    { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
