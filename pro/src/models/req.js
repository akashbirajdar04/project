import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // who sent the request
    },
    toOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // who should receive the request
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    details: {
      type: String, // optional message or additional data
      default: "",
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

// Optional: to prevent duplicate requests from same user to same owner
requestSchema.index({ fromUser: 1, toOwner: 1 }, { unique: true});

export const Request = mongoose.model("Request", requestSchema);
4