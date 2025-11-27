import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    day: { type: String, enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], required: true },
    slot: { type: String, enum: ["breakfast", "lunch", "dinner"], required: true },
    messId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

BookingSchema.index({ userId: 1, day: 1, slot: 1 }, { unique: true });

export const Booking = mongoose.model("Booking", BookingSchema);
