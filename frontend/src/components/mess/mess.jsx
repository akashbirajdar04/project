import { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import api from "../../lib/api";
import { UtensilsCrossed, Users, FileText, CalendarDays, ClipboardList, LogOut } from "lucide-react";
import { Announcements } from "../announcements";

export const Mess = () => {
  const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [day, _setDay] = useState(DAYS[todayIdx]);
  const [slot, _setSlot] = useState("lunch");
  const [week, setWeek] = useState({});
  const [_cap, setCap] = useState({ remaining: 0, total: 0 });
  const location = useLocation();
  const _isRoot = location.pathname === "/mess" || location.pathname === "/mess/";

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

  useEffect(() => {
    const loadCap = async () => {
      try {
        const res = await api.get("/mess/capacity", { params: { day, slot } });
        setCap(res.data?.data ?? { remaining: 0, total: 0 });
      } catch (e) {
        console.error(e);
      }
    };
    loadCap();
  }, [day, slot]);

  return (
    <div className="flex flex-col h-full font-sans bg-slate-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-bold te
          {/* ... rest of the component JSX ... */}
        </header>
        {/* ... other component parts ... */}
      </div>
      <Outlet />
    </div>
  );
};

// Note: The remainder of the original file (additional JSX and logic) remains unchanged.