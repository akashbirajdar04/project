import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect("mongodb+srv://akash:akash95189@cluster0.sy7yobp.mongodb.net/mydb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ DB connected successfully");
  } catch (error) {
    console.error("❌ DB cannot connect:", error.message);
    process.exit(1); // exit process if db fails
  }
};
