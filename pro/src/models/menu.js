import mongoose from "mongoose";

const MenuSchema = new mongoose.Schema(
  {
    day: { type: String, enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], required: true },
    slot: { type: String, enum: ["breakfast", "lunch", "dinner"], required: true },
    items: [
      {
        name: { type: String, required: true },
        allergens: [{ type: String }],
        tags: [{ type: String }],
        calories: { type: Number },
      },
    ],
    capacity: { type: Number, default: 100 },
    messId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

MenuSchema.index({ messId: 1, day: 1, slot: 1 }, { unique: true });

export const Menu = mongoose.model("Menu", MenuSchema);
