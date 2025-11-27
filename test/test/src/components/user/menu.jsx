import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { Calendar, Clock, Utensils, CheckCircle } from "lucide-react";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const SLOTS = ["breakfast", "lunch", "dinner"];

export const MenuView = () => {
  const [week, setWeek] = useState({});
  const [day, setDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [slot, setSlot] = useState("lunch");
  const [cap, setCap] = useState({ remaining: 0, total: 0 });
  const userId = localStorage.getItem("Id");

  const items = useMemo(() => week?.[day]?.[slot]?.items ?? [], [week, day, slot]);

  const loadWeek = async () => {
    try {
      const res = await api.get("/mess/menu/week");
      setWeek(res.data?.data ?? {});
    } catch (e) { console.error(e); }
  };

  const loadCap = async () => {
    try {
      const res = await api.get("/mess/capacity", { params: { day, slot } });
      setCap(res.data?.data ?? { remaining: 0, total: 0 });
    } catch (e) { console.error(e); }
  };

  useEffect(() => { loadWeek(); }, []);
  useEffect(() => { loadCap(); }, [day, slot]);

  // 🔔 Real-time update
  useEffect(() => {
    const handleUpdate = (data) => {
      if (data && data.relatedModel === "Menu") {
        console.log("Menu update received, reloading...");
        loadWeek();
        loadCap();
      }
    };
    import("../../lib/socket").then((mod) => {
      const socket = mod.default;
      socket.on("receive_notification", handleUpdate);
    });

    return () => {
      import("../../lib/socket").then((mod) => {
        const socket = mod.default;
        socket.off("receive_notification", handleUpdate);
      });
    };
  }, [day, slot]);

  const onBook = async () => {
    try {
      await api.post("/mess/book", { userId, day, slot });
      await loadCap();
      alert("Booked!");
    } catch (e) {
      alert(e?.response?.data?.message || "Booking failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mess Menu</h1>
          <p className="text-slate-500 text-sm mt-1">View menu and book your meals</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:ring-blue-500 focus:border-blue-500 uppercase"
            >
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:ring-blue-500 focus:border-blue-500 capitalize"
            >
              {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button
            onClick={onBook}
            className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Book Meal
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800 flex items-center capitalize">
            <Utensils className="w-5 h-5 mr-2 text-blue-600" />
            {day} • {slot}
          </h3>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
            {cap.remaining} slots left
          </span>
        </div>

        <div className="p-6">
          {items.length === 0 ? (
            <div className="text-center py-8 text-slate-500 italic">
              No menu items available for this slot.
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((it, idx) => (
                <li key={idx} className="flex items-start p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <div className="h-2 w-2 mt-2 rounded-full bg-blue-400 mr-3 flex-shrink-0" />
                  <div>
                    <span className="text-slate-800 font-medium block">
                      {typeof it === 'string' ? it : it.name}
                    </span>
                    {typeof it !== 'string' && it.allergens?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {it.allergens.map(a => (
                          <span key={a} className="text-[10px] uppercase tracking-wider font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuView;
