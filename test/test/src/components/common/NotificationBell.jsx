import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import socket from "../../lib/socket";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userId = localStorage.getItem("Id");

    useEffect(() => {
        if (!userId) return;

        const register = () => {
            console.log("Registering user for notifications:", userId);
            socket.emit("register_user", userId);
        };

        // Initial registration
        if (socket.connected) register();

        // Re-register on connect (handles server restarts)
        socket.on("connect", register);

        // Listen for notifications
        const handleNotification = (notification) => {
            console.log("🔔 Client received notification:", notification);
            setNotifications((prev) => [notification, ...prev]);
            setUnreadCount((prev) => prev + 1);

            // Show toast
            if (notification.type === "success") toast.success(notification.message);
            else if (notification.type === "error") toast.error(notification.message);
            else if (notification.type === "warning") toast.warning(notification.message);
            else toast.info(notification.message);
        };

        socket.on("receive_notification", handleNotification);

        // Listen for chat notifications
        const handleChatNotification = (data) => {
            console.log("🔔 Client received chat notification:", data);
            const notif = {
                message: `New message: ${data.message}`,
                type: "info",
                createdAt: data.createdAt
            };
            setNotifications((prev) => [notif, ...prev]);
            setUnreadCount((prev) => prev + 1);
            toast.info(`New message: ${data.message}`);
            // Trigger update for sidebar badge
            window.dispatchEvent(new Event("messagesRead"));
        };

        socket.on("new_notification", handleChatNotification);

        // Test toast to verify sonner works
        // toast.info("Notification system ready"); 

        return () => {
            socket.off("connect", register);
            socket.off("receive_notification", handleNotification);
            socket.off("new_notification", handleChatNotification);
        };
    }, [userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            // Mark as read logic could go here (e.g., API call)
            setUnreadCount(0);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-slate-500 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                        {notifications.length > 0 && (
                            <button
                                onClick={() => setNotifications([])}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <p className="text-sm">No new notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {notifications.map((notif, index) => (
                                    <div key={index} className="p-4 hover:bg-slate-50 transition-colors">
                                        <p className="text-sm text-slate-800">{notif.message}</p>
                                        <span className="text-xs text-slate-400 mt-1 block">
                                            {new Date(notif.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
