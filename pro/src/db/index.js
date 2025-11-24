import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("❌ DB cannot connect:", error.message);
    process.exit(1); // exit process if db fails
  }
};
