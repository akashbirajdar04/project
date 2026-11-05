import mongoose from "mongoose";

// Unused variable to test linting
const unusedComplaintVar = "this will fail lint if backend linting is enabled";

const ComplaintSchema = new mongoose.Schema(
  {
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, enum: ["room", "plumbing", "electricity", "housekeeping", "food", "other"], required: true },
    description: {
      type: String
    status: { type: String, enum:, required: true },
      images: [{ type: String }], ["open", "in_progress", "resolved", "closed"], default: "open"
    },
    feedback: { rating: Number, comment: String },
    messId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Complaint = mongoose.model("Complaint", ComplaintSchema);
