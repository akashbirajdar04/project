import React, { useState, useEffect } from 'react';
import api from "../lib/api";
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    Home,
    User,
    MessageSquare,
    Bell,
    LogOut,
    Menu,
    X,
    Building2,
    Utensils,
    FileText,
    AlertCircle,
    UtensilsCrossed,
    Users,
    Search,
    Star
} from 'lucide-react';
import NotificationBell from './common/NotificationBell';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    const [enrolledMess, setEnrolledMess] = useState(null);
    const [enrolledHostel, setEnrolledHostel] = useState(null);
    const userId = localStorage.getItem("Id");

    useEffect(() => {
        const checkEnrollment = async () => {
            if (userId) {
                try {
                    const m = await api.get(`/student/${userId}/mess`);
                    setEnrolledMess(m.data?.data || null);
                } catch (e) { console.error(e); }
                try {
                    const h = await api.get(`/Profile/student/${userId}/hostel`);
                    const arr = h.data?.data || [];
                    setEnrolledHostel(Array.isArray(arr) ? arr[0] || null : null);
                } catch (e) { console.error(e); }
            }
        };
        checkEnrollment();
    }, [userId]);

    const role = localStorage.getItem("role");

    const studentNav = [
        { to: "/Profile", icon: Home, label: "Dashboard" },
        { to: "/Profile/student-profile", icon: User, label: "Profile" },
        { to: "/Profile/announcements", icon: Bell, label: "Announcements" },
        { to: "/Profile/complaints", icon: AlertCircle, label: "Complaints" },
        ...(enrolledMess ? [{ to: "/Profile/menu", icon: Utensils, label: "My Mess" }] : []),
        ...(enrolledHostel ? [{ to: "/Profile", icon: Building2, label: "My Hostel" }] : []),
        { to: "/Profile/Mlist", icon: UtensilsCrossed, label: "Mess List" },
        { to: "/Profile/Hlist", icon: Building2, label: "Hostel List" },
        { to: "/Profile/roommate-finder", icon: Users, label: "Students" },
        { to: "/Profile/lost-found", icon: Search, label: "Lost & Found" },
        { to: "/Profile/meal-feedback", icon: Star, label: "Meal Feedback" },
        { to: "/Profile/msg", icon: MessageSquare, label: "Messages" },
        { to: "/Profile/polls", icon: FileText, label: "Polls" },
    ];

    const messOwnerNav = [
        { to: "/Profile", icon: Home, label: "Dashboard" },
        { to: "/Profile/Messprofile", icon: User, label: "Profile" },
        { to: "/Profile/announcements", icon: Bell, label: "Announcements" },
        { to: "/Profile/polls", icon: FileText, label: "Polls" },
        { to: "/Profile/Messrequests", icon: FileText, label: "Requests" },
        { to: "/Profile/mess-menu", icon: Utensils, label: "Menu Management" },
        { to: "/Profile/Messaccepted", icon: UtensilsCrossed, label: "Accepted Members" },
        { to: "/Profile/messege", icon: MessageSquare, label: "Messages" },
    ];

    const hostelOwnerNav = [
        { to: "/Profile", icon: Home, label: "Dashboard" },
        { to: "/Profile/profile", icon: User, label: "Profile" },
        { to: "/Profile/announcements", icon: Bell, label: "Announcements" },
        { to: "/Profile/polls", icon: FileText, label: "Polls" },
        { to: "/Profile/requests", icon: FileText, label: "Requests" },
        { to: "/Profile/hostel-structure", icon: Building2, label: "Structure" },
        { to: "/Profile/hostel-allocation", icon: User, label: "Allocation" }, // Reusing User icon for now
        { to: "/Profile/acceptedreq", icon: FileText, label: "Accepted Requests" },
        { to: "/Profile/messege", icon: MessageSquare, label: "Messages" },
    ];

    const adminNav = [
        { to: "/Profile/admin", icon: Home, label: "Admin Dashboard" },
        { to: "/Profile/announcements", icon: Bell, label: "Announcements" },
        { to: "/Profile/polls", icon: FileText, label: "Polls" },
    ];

    let navItems = [];
    if (role === 'messowner') {
        navItems = messOwnerNav;
    } else if (role === 'hostelowner') {
        navItems = hostelOwnerNav;
    } else if (role === 'admin') {
        navItems = adminNav;
    } else {
        navItems = studentNav;
    }

    // Check if user is admin/owner to show more links (simplified logic for now)
    // You might want to add more conditional links here based on user role

    const [unreadChatterCount, setUnreadChatterCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (!userId) return;
            try {
                const res = await api.get("/Profile/messages/unread-count");
                if (res.data.success) {
                    setUnreadChatterCount(res.data.data.count);
                }
            } catch (err) {
                console.error("Error fetching unread count:", err);
            }
        };

        fetchUnreadCount();

        // Listen for new notifications to update count
        // Note: Ideally, we should check if the sender is already counted, 
        // but for simplicity, we can just re-fetch or increment if we assume it's a new chatter.
        // Re-fetching is safer to avoid sync issues.
        const handleNewNotification = () => {
            fetchUnreadCount();
        };

        // Also listen for when we read messages (if we emit an event for that, or just rely on navigation)
        // For now, we rely on the fact that navigating to a chat will eventually trigger a re-fetch if we add it to dependency
        // or we can expose a global context. 
        // A simple way is to re-fetch on location change if we are navigating away from a chat?
        // Or just re-fetch periodically. 
        // Let's stick to socket for increments. Decrements happen when we open a chat, 
        // but Layout doesn't know when that happens easily without context.
        // We can add a custom event listener for "messagesRead".

        const handleMessagesRead = () => fetchUnreadCount();

        window.addEventListener("messagesRead", handleMessagesRead);
        // Assuming socket is imported or available via context. 
        // Layout doesn't import socket directly in the original file, checking imports...
        // It imports NotificationBell which uses socket. 
        // We might need to import socket here or rely on NotificationBell to trigger an update?
        // Let's import socket.

        return () => {
            window.removeEventListener("messagesRead", handleMessagesRead);
        };
    }, [userId]);

    // ... (rest of the nav logic)

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar - Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 flex-shrink-0">
                    <span className="text-2xl font-bold text-blue-600">CampusLife</span>
                    <button onClick={toggleSidebar} className="md:hidden text-slate-500 hover:text-blue-600">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                                }`
                            }
                        >
                            <div className="flex items-center">
                                <item.icon size={20} className="mr-3" />
                                {item.label}
                            </div>
                            {item.label === "Messages" && unreadChatterCount > 0 && (
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {unreadChatterCount}
                                </span>
                            )}
                        </NavLink>
                    ))}

                    <div className="mt-2">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        >
                            <LogOut size={20} className="mr-3" />
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex items-center justify-between h-16 px-6 bg-white shadow-sm border-b border-slate-100">
                    <button onClick={toggleSidebar} className="md:hidden text-slate-500 hover:text-blue-600">
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center space-x-4 ml-auto">
                        <NotificationBell />
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                U
                            </div>
                            <span className="text-sm font-medium text-slate-700 hidden sm:block">User</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default Layout;
