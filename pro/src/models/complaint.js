import mongoose from "mongoose";

const ComplaintSchema = new mongoose.Schema(
  {
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, enum: ["room", "plumbing", "electricity", "housekeeping", "food", "other"], required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
    feedback: { rating: Number, comment: String },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", ComplaintSchema);
