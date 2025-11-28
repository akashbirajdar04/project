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
    UtensilsCrossed
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
                } catch (_) { }
                try {
                    const h = await api.get(`/Profile/student/${userId}/hostel`);
                    const arr = h.data?.data || [];
                    setEnrolledHostel(Array.isArray(arr) ? arr[0] || null : null);
                } catch (_) { }
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
        { to: "/Profile/msg", icon: MessageSquare, label: "Messages" },
    ];

    const messOwnerNav = [
        { to: "/Profile", icon: Home, label: "Dashboard" },
        { to: "/Profile/Messprofile", icon: User, label: "Profile" },
        { to: "/Profile/announcements", icon: Bell, label: "Announcements" },
        { to: "/Profile/Messrequests", icon: FileText, label: "Requests" },
        { to: "/Profile/mess-menu", icon: Utensils, label: "Menu Management" },
        { to: "/Profile/Messaccepted", icon: UtensilsCrossed, label: "Accepted Members" },
        { to: "/Profile/messege", icon: MessageSquare, label: "Messages" },
    ];

    const hostelOwnerNav = [
        { to: "/Profile", icon: Home, label: "Dashboard" },
        { to: "/Profile/profile", icon: User, label: "Profile" },
        { to: "/Profile/announcements", icon: Bell, label: "Announcements" },
        { to: "/Profile/requests", icon: FileText, label: "Requests" },
        { to: "/Profile/hostel-structure", icon: Building2, label: "Structure" },
        { to: "/Profile/hostel-allocation", icon: User, label: "Allocation" }, // Reusing User icon for now
        { to: "/Profile/acceptedreq", icon: FileText, label: "Accepted Requests" },
        { to: "/Profile/messege", icon: MessageSquare, label: "Messages" },
    ];

    const adminNav = [
        { to: "/Profile/admin", icon: Home, label: "Admin Dashboard" },
        { to: "/Profile/announcements", icon: Bell, label: "Announcements" },
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

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar - Desktop */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100">
                    <span className="text-2xl font-bold text-blue-600">CampusLife</span>
                    <button onClick={toggleSidebar} className="md:hidden text-slate-500 hover:text-blue-600">
                        <X size={24} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                                }`
                            }
                        >
                            <item.icon size={20} className="mr-3" />
                            {item.label}
                        </NavLink>
                    ))}

                    <div className="pt-4 mt-4 border-t border-slate-100">
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
