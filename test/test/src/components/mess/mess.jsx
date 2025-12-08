import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import api from "../../lib/api";
import { UtensilsCrossed, Users, FileText, CalendarDays, ClipboardList, LogOut } from "lucide-react";
import { Announcements } from "../announcements";

export const Mess = () => {
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1
  const [day, setDay] = useState(DAYS[todayIdx])
  const [slot, setSlot] = useState("lunch")
  const [week, setWeek] = useState({})
  const [cap, setCap] = useState({ remaining: 0, total: 0 })
  const location = useLocation();
  const isRoot = location.pathname === "/mess" || location.pathname === "/mess/";

  const items = useMemo(() => week?.[day]?.[slot]?.items ?? [], [week, day, slot])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/mess/menu/week")
        setWeek(res.data?.data ?? {})
      } catch (e) { console.error(e); }
    }
    load()
  }, [])

  useEffect(() => {
    const loadCap = async () => {
      try {
        const res = await api.get("/mess/capacity", { params: { day, slot } })
        setCap(res.data?.data ?? { remaining: 0, total: 0 })
      } catch (e) { console.error(e); }
    }
    loadCap()
  }, [day, slot])

  return (
    <div className="flex flex-col h-full font-sans bg-slate-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-bold text-slate-800">Dashboard Overview</h2>

          {/* Quick Stats / Menu Preview in Header */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase">Today's Capacity</span>
              <div className="h-4 w-px bg-slate-300"></div>
              <span className="text-sm font-bold text-blue-600">{cap.remaining} / {cap.total}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {isRoot && (
            <div className="mb-8">
              <Announcements />
            </div>
          )}
          {/* Optional: Dashboard Summary Widgets if at root path */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};
