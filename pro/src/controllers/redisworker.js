import { notificationQueue } from "../config/queue.js";
import { Student, Mess, Hostel } from "../models/user.module.js";
import { Notification } from "../models/notification.js";

export const initWorker = (io) => {
    console.log("👷 Redis Worker Started...");

    notificationQueue.process(async (job) => {
        const { type, scope, creatorId, title, message, announcementId } = job.data;
        console.log(`⚙️ Processing job: ${type} for scope: ${scope}`);

        try {
            let recipients = [];

            // 1️⃣ Identify Recipients based on Scope
            if (scope === "global") {
                // Fetch ALL students
                recipients = await Student.find({ role: "student" }).select("_id");
            } else if (scope === "mess") {
                // Fetch students enrolled in this mess
                // creatorId is the Mess Owner ID
                recipients = await Student.find({ messid: creatorId }).select("_id");
            } else if (scope === "hostel") {
                // Fetch students enrolled in this hostel
                recipients = await Student.find({ hostelid: creatorId }).select("_id");
            }

            console.log(`📢 Sending to ${recipients.length} users...`);

            // 2️⃣ Send Notifications (Batching would be better for thousands, but this is a start)
            const notifications = recipients.map((user) => ({
                recipient: user._id,
                type: "info",
                message: `📢 New Announcement: ${title}`,
                relatedId: announcementId,
                onModel: "Announcement",
            }));

            // Bulk insert into DB
            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }

            // 3️⃣ Real-time Socket Emission
            recipients.forEach((user) => {
                // Emit to the user's private room
                io.to(user._id.toString()).emit("receive_notification", {
                    type: "info",
                    message: `📢 New Announcement: ${title}`,
                    relatedId: announcementId,
                });
            });

            console.log("✅ Job Completed!");
        } catch (error) {
            console.error("❌ Job Failed:", error);
            throw error; // Triggers Bull retry
        }
    });
};