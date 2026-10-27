import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import api from "../../lib/api";
import { UtensilsCrossed, Users, FileText, CalendarDays, ClipboardList, LogOut } from "lucide-react";
import { Announcements } from "../announcements";

export const Mess = () => {
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [day, _setDay] = useState(DAYS[todayIdx]);
  const [slot, _setSlot] = useState("lunch");
  const [week, setWeek] = useState({});

  const _items = useMemo(() => week?.[day]?.[slot]?.items ?? [], [week, day, slot]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/mess/menu/week");
        setWeek(res.data?.data ?? {});
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  return (
    <div className="flex flex-col h-full font-sans bg-slate-50">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
        <h2 className="text-xl font-bold">Mess Menu</h2>
        <nav className="flex space-x-4">
          <NavLink to="/mess/announcements" className={({ isActive }) => (isActive ? "text-blue-600" : "text-gray-600")}>
            <Announcements />
          </NavLink>
          <NavLink to="/logout" className="text-gray-600">
            <LogOut />
          </NavLink>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto p-4">
        {/* Day and Slot selectors (simplified) */}
        <div className="flex space-x-2 mb-4">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => _setDay(d)}
              className={`px-3 py-1 rounded ${d === day ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {d.toUpperCase()}
            </button>
          ))}
          <button
            onClick={() => _setSlot("lunch")}
            className={`px-3 py-1 rounded ${slot === "lunch" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Lunch
          </button>
          <button
            onClick={() => _setSlot("dinner")}
            className={`px-3 py-1 rounded ${slot === "dinner" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Dinner
          </button>
        </div>

        {/* Menu Items */}
        <ul className="space-y-2">
          {_items.length > 0 ? (
            _items.map((item, idx) => (
              <li key={idx} className="p-2 border rounded bg-white shadow-sm">
                {item.name}
              </li>
            ))
          ) : (
            <li className="text-gray-500">No items available for the selected day/slot.</li>
          )}
        </ul>

        {/* Nested routes */}
        <Outlet />
      </div>
    </div>
  );
};