import { Notification } from "../models/notification.js";

/**
 * Sends a notification to a user.
 * Saves it to the database and emits a socket event.
 * 
 * @param {Object} req - Express request object (to access io)
 * @param {string} recipientId - The ID of the user receiving the notification
 * @param {string} type - 'info', 'success', 'error', 'warning'
 * @param {string} message - The notification message
 * @param {string} [relatedId] - Optional ID of related entity (e.g., Complaint ID)
 * @param {string} [onModel] - Optional model name for related entity
 */
export const sendNotification = async (req, recipientId, type, message, relatedId = null, onModel = null) => {
    try {
        // 1. Save to Database
        const notification = await Notification.create({
            recipient: recipientId,
            type,
            message,
            relatedId,
            onModel
        });

        // 2. Emit Socket Event
        const io = req.app.get("io");
        if (io) {
            // Emit to a room named after the user's ID (assuming users join their own room on login)
            // Or we can iterate sockets, but room is better.
            // In app.js, we see: socket.on("join_room", ...) which joins "sender_receiver".
            // We need a dedicated room for the user.
            // Let's assume the frontend will join a room "user_<userId>" or just "<userId>"

            io.to(recipientId.toString()).emit("receive_notification", notification);
            console.log(`🔔 Notification emitted to room ${recipientId}: ${message}`);
        } else {
            console.error("❌ Socket.IO instance not found on req.app");
        }

        return notification;
    } catch (error) {
        console.error("❌ Error sending notification:", error);
    }
};
