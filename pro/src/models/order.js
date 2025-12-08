import mongoose from "mongoose";

const RazorpayOrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true
    },
    razorpayPaymentId: {
        type: String,
        required: false, // Not required initially
        unique: true,
        sparse: true // Allows null/undefined to be unique
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"
    },
    status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending"
    },
    paidAt: {
        type: Date,
        default: null
    },
}, { timestamps: true });

export const RazorpayOrder = mongoose.model("RazorpayOrder", RazorpayOrderSchema);