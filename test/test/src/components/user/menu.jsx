import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";

const DAYS = ["mon","tue","wed","thu","fri","sat","sun"];
const SLOTS = ["breakfast","lunch","dinner"];

export const MenuView = () => {
  const [week, setWeek] = useState({});
  const [day, setDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay()-1]);
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Mess Menu</h1>
        <div className="flex gap-2">
          <select value={day} onChange={(e)=>setDay(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300">
            {DAYS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
          </select>
          <select value={slot} onChange={(e)=>setSlot(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300">
            {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={onBook} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Book</button>
        </div>
      </div>

      <div className="text-sm text-slate-600">Capacity: {cap.remaining} left / {cap.total}</div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-2">{day.toUpperCase()} • {slot}</h3>
        {items.length === 0 ? (
          <div className="text-slate-500">No items set</div>
        ) : (
          <ul className="list-disc pl-5 space-y-1">
            {items.map((it, idx) => (
              <li key={idx} className="text-slate-800">
                {typeof it === 'string' ? it : it.name}
                {typeof it !== 'string' && it.allergens?.length ? (
                  <span className="ml-2 text-xs text-slate-500">Allergens: {it.allergens.join(", ")}</span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MenuView;
