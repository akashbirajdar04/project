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
    Star,
    Shield
} from 'lucide-react';
import NotificationBell from './common/NotificationBell';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const [enrolledMess, setEnrolledMess] = useState(null);
    const [enrolledHostel, setEnrolledHostel] = useState(null);
    const userId = localStorage.getItem("Id");
    const role = localStorage.getItem("role") || "student";

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
        { to: "/Profile/hostel-allocation", icon: User, label: "Allocation" },
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
        const handleMessagesRead = () => fetchUnreadCount();
        window.addEventListener("messagesRead", handleMessagesRead);

        return () => {
            window.removeEventListener("messagesRead", handleMessagesRead);
        };
    }, [userId]);

    const formattedRole = role === 'messowner' ? 'Mess Owner' : role === 'hostelowner' ? 'Hostel Owner' : role === 'admin' ? 'Admin' : 'Student';

    return (
        <div className="flex h-screen bg-slate-50/60 overflow-hidden font-sans">
            {/* Sidebar - Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/80 shadow-xs transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}>
                <div className="flex items-center justify-between h-16 px-5 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm shadow-xs">
                            CL
                        </div>
                        <span className="text-lg font-semibold text-slate-900 tracking-tight">CampusLife</span>
                    </div>
                    <button onClick={toggleSidebar} className="md:hidden text-slate-400 hover:text-slate-600 p-1">
                        <X size={20} />
                    </button>
                </div>

                <div className="px-4 py-3 border-b border-slate-100/80">
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{role.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-slate-900 truncate">Account</p>
                            <p className="text-[11px] text-slate-500 capitalize">{formattedRole}</p>
                        </div>
                    </div>
                </div>

                <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.to}
                            onClick={() => setIsSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${isActive
                                    ? "bg-indigo-50 text-indigo-600 font-semibold"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                }`
                            }
                        >
                            <div className="flex items-center">
                                <item.icon size={16} className="mr-2.5 shrink-0 opacity-80" />
                                <span>{item.label}</span>
                            </div>
                            {item.label === "Messages" && unreadChatterCount > 0 && (
                                <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">
                                    {unreadChatterCount}
                                </Badge>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 border-t border-slate-100">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-9"
                    >
                        <LogOut size={16} className="mr-2.5" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-slate-200/80 shadow-xs z-10">
                    <button onClick={toggleSidebar} className="md:hidden text-slate-500 hover:text-slate-700 p-1">
                        <Menu size={20} />
                    </button>

                    <div className="flex items-center space-x-3 ml-auto">
                        <NotificationBell />
                        <div className="h-4 w-px bg-slate-200"></div>
                        <div className="flex items-center space-x-2.5 pl-1">
                            <Avatar className="h-8 w-8 border-slate-200">
                                <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs">U</AvatarFallback>
                            </Avatar>
                            <div className="hidden sm:block text-left">
                                <span className="block text-xs font-medium text-slate-800">User Dashboard</span>
                                <span className="block text-[10px] text-slate-400 uppercase tracking-wider">{role}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto animate-fadeIn">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
};

export default Layout;
