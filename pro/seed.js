import mongoose from "mongoose";
import dotenv from "dotenv";
import { User, Student, Mess, Hostel, Admin } from "./src/models/user.module.js";
import { Menu } from "./src/models/menu.js";
import HostelStructure from "./src/models/hostel-structure.js";
import { Booking } from "./src/models/booking.js";
import { Complaint } from "./src/models/complaint.js";
import { Announcement } from "./src/models/announcement.js";
import { Poll } from "./src/models/poll.js";
import { RoommateRequest } from "./src/models/roommate-request.js";

dotenv.config({ path: "./.env" });

const MONGODB_URI = process.env.DB || process.env.MONGODB_URI || "mongodb://localhost:27017/campuslife";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`\n MongoDB connected !! DB HOST: ${mongoose.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error ", error);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    console.log("🧹 Clearing existing data...");

    // Drop problematic index if it exists
    try {
        await User.collection.dropIndex("address_1");
        console.log("⚠️ Dropped lingering 'address_1' index.");
    } catch (e) {
        // Ignore error if index doesn't exist
    }

    await Promise.all([
        User.deleteMany({}),
        Menu.deleteMany({}),
        HostelStructure.deleteMany({}),
        Booking.deleteMany({}),
        Complaint.deleteMany({}),
        Announcement.deleteMany({}),
        Poll.deleteMany({}),
        RoommateRequest.deleteMany({}),
    ]);

    console.log("🌱 Seeding data...");

    // 1. Create Admin
    const admin = await Admin.create({
        username: "admin",
        email: "admin@campus.com",
        password: "password123",
        role: "admin",
        fullname: "System Admin",
        isEmailVerified: true,
    });
    console.log("✅ Admin created");

    // 2. Create Mess Owners (2 Messes)
    const messOwners = await Mess.create([
        {
            username: "mess_a",
            email: "messa@campus.com",
            password: "password123",
            role: "messowner",
            fullname: "Mess A Owner",
            name: "Mess A",
            description: "Best North Indian Food",
            price: "3500",
            contact: "9876543210",
            location: { city: "Pune", state: "MH" },
            isEmailVerified: true,
        },
        {
            username: "mess_b",
            email: "messb@campus.com",
            password: "password123",
            role: "messowner",
            fullname: "Mess B Owner",
            name: "Mess B",
            description: "Authentic South Indian",
            price: "3200",
            contact: "9876543211",
            location: { city: "Pune", state: "MH" },
            isEmailVerified: true,
        },
    ]);
    console.log("✅ Mess Owners created");

    // 3. Create Hostel Owners (2 Hostels)
    const hostelOwners = await Hostel.create([
        {
            username: "hostel_x",
            email: "hostelx@campus.com",
            password: "password123",
            role: "hostelowner",
            fullname: "Hostel X Owner",
            name: "Hostel X",
            description: "Luxury Stay",
            price: "50000",
            contact: "9876543220",
            location: { city: "Pune", state: "MH" },
            isEmailVerified: true,
        },
        {
            username: "hostel_y",
            email: "hostely@campus.com",
            password: "password123",
            role: "hostelowner",
            fullname: "Hostel Y Owner",
            name: "Hostel Y",
            description: "Budget Friendly",
            price: "35000",
            contact: "9876543221",
            location: { city: "Pune", state: "MH" },
            isEmailVerified: true,
        },
    ]);
    console.log("✅ Hostel Owners created");

    // 4. Create Students (20 Students)
    const studentsData = [];
    for (let i = 1; i <= 20; i++) {
        const messId = i <= 10 ? messOwners[0]._id : messOwners[1]._id;
        const hostelId = i <= 10 ? hostelOwners[0]._id : hostelOwners[1]._id;

        studentsData.push({
            username: `student_${i}`,
            email: `student${i}@campus.com`,
            password: "password123",
            role: "student",
            fullname: `Student ${i}`,
            course: "B.Tech",
            year: "2",
            contact: `90000000${i.toString().padStart(2, '0')}`,
            messid: messId,
            hostelid: hostelId,
            isEmailVerified: true,
        });
    }
    const students = await Student.create(studentsData);
    console.log("✅ Students created");

    // Update Owners with accepted students
    await Mess.findByIdAndUpdate(messOwners[0]._id, { $push: { accepted: { $each: students.slice(0, 10).map(s => s._id) } } });
    await Mess.findByIdAndUpdate(messOwners[1]._id, { $push: { accepted: { $each: students.slice(10, 20).map(s => s._id) } } });
    await Hostel.findByIdAndUpdate(hostelOwners[0]._id, { $push: { accepted: { $each: students.slice(0, 10).map(s => s._id) } } });
    await Hostel.findByIdAndUpdate(hostelOwners[1]._id, { $push: { accepted: { $each: students.slice(10, 20).map(s => s._id) } } });

    // 5. Create Menus for Messes
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
    const slots = ["breakfast", "lunch", "dinner"];
    const menuData = [];

    for (const mess of messOwners) {
        for (const day of days) {
            for (const slot of slots) {
                menuData.push({
                    messId: mess._id,
                    day,
                    slot,
                    items: [{ name: "Rice" }, { name: "Dal" }, { name: "Roti" }, { name: "Sabji" }],
                    capacity: 100,
                });
            }
        }
    }
    await Menu.create(menuData);
    console.log("✅ Menus created");

    // 6. Create Hostel Structure
    for (const hostel of hostelOwners) {
        await HostelStructure.create({
            hostelId: hostel._id,
            blocks: [
                {
                    name: "Block A",
                    floors: [
                        {
                            name: "Ground Floor",
                            rooms: [
                                { number: "101", beds: [{ number: 1 }, { number: 2 }] },
                                { number: "102", beds: [{ number: 1 }, { number: 2 }] },
                            ],
                        },
                    ],
                },
            ],
        });
    }
    console.log("✅ Hostel Structures created");

    // 7. Create Announcements
    await Announcement.create([
        { title: "Welcome to Mess A", body: "Enjoy your meals!", scope: "mess", createdBy: messOwners[0]._id },
        { title: "Hostel Rules", body: "No noise after 10 PM", scope: "hostel", createdBy: hostelOwners[0]._id },
        { title: "Campus Fest", body: "Join us this weekend!", scope: "global", createdBy: admin._id },
    ]);
    console.log("✅ Announcements created");

    // 8. Create Polls
    await Poll.create({
        question: "Sunday Special?",
        options: ["Biryani", "Fried Rice"],
        createdBy: messOwners[0]._id,
        scope: "mess",
        votes: { "Biryani": 5, "Fried Rice": 3 },
        voters: students.slice(0, 8).map(s => s._id)
    });
    console.log("✅ Polls created");

    console.log("\n🎉 Database seeded successfully!");
    process.exit(0);
};

seedData();
