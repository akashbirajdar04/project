import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User } from "./src/models/user.module.js";

dotenv.config({ path: path.resolve("./.env") });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.DB);
        console.log("✅ DB Connected");

        const adminExists = await User.findOne({ role: "admin" });
        if (adminExists) {
            console.log("⚠️ Admin already exists:", adminExists.email);
            process.exit(0);
        }

        const admin = await User.create({
            username: "admin",
            email: "admin@campuslife.com",
            password: "adminpassword123", // Will be hashed by pre-save hook
            role: "admin",
            isEmailVerified: true
        });

        console.log("🎉 Admin created successfully:", admin.email);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
