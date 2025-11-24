import { NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogOut, Home, User, FileText } from "lucide-react";

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
    <div className="flex h-screen w-screen font-sans bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Sidebar */}
      <aside className="w-64 bg-emerald-700 text-white flex flex-col py-8 px-6 shadow-xl">
        <div className="flex items-center gap-3 mb-10">
          <Home className="w-7 h-7" />
          <h1 className="text-2xl font-bold tracking-wide">🏠 Hostel Dashboard</h1>
        </div>
        <nav className="flex flex-col gap-4">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive ? "bg-emerald-600 text-white" : "hover:bg-emerald-600 hover:text-white text-emerald-100"
              }`
            }
          >
            <User className="w-5 h-5" />
            Profile
          </NavLink>
          <NavLink
            to="requests"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive ? "bg-emerald-600 text-white" : "hover:bg-emerald-600 hover:text-white text-emerald-100"
              }`
            }
          >
            Requests
          </NavLink>
          <NavLink
            to="hostel-structure"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-100 hover:bg-emerald-700/40"
              }`
            }
          >
            Structure
          </NavLink>
          <NavLink
            to="hostel-allocation"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-100 hover:bg-emerald-700/40"
              }`
            }
          >
            Allocation
          </NavLink>
          <NavLink
            to="messege"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive ? "bg-emerald-600 text-white" : "hover:bg-emerald-600 hover:text-white text-emerald-100"
              }`
            }
          >
            💬 Message
          </NavLink>
        </nav>
        <div className="flex-1"></div>
        <div className="mt-8 flex flex-col gap-4">
          <span className="text-sm text-emerald-100 flex items-center gap-2">
            🕒 {time}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold text-white transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center overflow-y-auto">
        {/* Welcome Section */}
        <section className="text-center mt-16 mb-6 w-full max-w-2xl">
          <h2 className="text-3xl font-extrabold text-emerald-700">Welcome Back!</h2>
          <p className="text-gray-600 mt-2 text-lg">
            Manage your hostel activities efficiently and stay updated.
          </p>
        </section>
        {/* Outlet for nested routes */}
        <div className="w-full px-4 md:px-16">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
