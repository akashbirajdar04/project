import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Home, User, FileText, Users } from "lucide-react";

export const Hostel = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="w-full px-4 md:px-8 pt-8 md:pt-10 pb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-emerald-100 p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-md">
              <Home className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent leading-tight">Hostel Management Dashboard</h1>
              <p className="text-slate-600 text-sm md:text-base mt-1">Manage profile, review requests, and track your activities.</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 card-hover ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                  : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
              }`
            }
          >
            <User className="w-4 h-4 inline mr-2" />
            Profile
          </NavLink>

          <NavLink
            to="requests"
            className={({ isActive }) =>
              `px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 card-hover ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                  : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
              }`
            }
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Requests
          </NavLink>

          <NavLink
            to="hostel-structure"
            className={({ isActive }) =>
              `px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 card-hover ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                  : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
              }`
            }
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Structure
          </NavLink>

          <NavLink
            to="hostel-allocation"
            className={({ isActive }) =>
              `px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 card-hover ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-600 shadow-lg"
                  : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
              }`
            }
          >
            <Users className="w-4 h-4 inline mr-2" />
            Allocation
          </NavLink>

          <NavLink
            to="messege"
            className={({ isActive }) =>
              `px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 card-hover ${
                isActive
                  ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white border-teal-600 shadow-lg"
                  : "bg-white text-teal-700 border-teal-200 hover:bg-teal-50 hover:border-teal-300"
              }`
            }
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Messages
          </NavLink>

          <button
            onClick={handleLogout}
            className="px-5 py-3 rounded-xl text-sm font-semibold transition-all shadow-md border-2 bg-red-500 hover:bg-red-600 text-white border-red-600 shadow-lg card-hover"
          >
            <LogOut className="w-4 h-4 inline mr-2" size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* Render child routes */}
      <div className="flex-1 w-full px-4 md:px-8 pb-8">
        <div className="bg-white/80 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-lg border-2 border-slate-200 min-h-[60vh]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
