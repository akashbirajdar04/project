import { Outlet, useLocation } from "react-router-dom";
import { Announcements } from "../announcements";

export const Hostel = () => {
  const location = useLocation();
  const isRoot = location.pathname === "/hostel" || location.pathname === "/hostel/";

  return (
    <div className="flex flex-col h-full font-sans bg-slate-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              H
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {isRoot && (
            <div className="mb-8">
              <Announcements />
            </div>
          )}
          <Outlet />
        </div>
      </div>
    </div>
  );
};