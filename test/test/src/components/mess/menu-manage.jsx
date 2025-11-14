import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";

const DAYS = ["mon","tue","wed","thu","fri","sat","sun"];
const SLOTS = ["breakfast","lunch","dinner"];

const MessMenuManage = () => {
  const [week, setWeek] = useState({});
  const [day, setDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay()-1]);
  const [slot, setSlot] = useState("lunch");
  const [capacity, setCapacity] = useState(100);
  const [newItem, setNewItem] = useState({ name: "", allergens: "", calories: "" });
  const [saving, setSaving] = useState(false);

  const items = useMemo(() => week?.[day]?.[slot]?.items ?? [], [week, day, slot]);

  const loadWeek = async () => {
    try {
      const res = await api.get("/mess/menu/week");
      const data = res.data?.data ?? {};
      setWeek(data);
      const cap = data?.[day]?.[slot]?.capacity ?? 100;
      setCapacity(cap);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load menu");
    }
  };

  useEffect(() => { loadWeek(); }, []);
  useEffect(() => {
    const cap = week?.[day]?.[slot]?.capacity ?? 100;
    setCapacity(cap);
  }, [day, slot, week]);

  const onAddItem = () => {
    if (!newItem.name.trim()) return;
    const entry = {
      name: newItem.name.trim(),
      allergens: newItem.allergens.split(",").map(s => s.trim()).filter(Boolean),
      calories: newItem.calories ? Number(newItem.calories) : undefined,
    };
    const copy = structuredClone(week);
    copy[day] = copy[day] || {};
    copy[day][slot] = copy[day][slot] || { items: [], capacity: capacity };
    copy[day][slot].items = [...(copy[day][slot].items || []), entry];
    setWeek(copy);
    setNewItem({ name: "", allergens: "", calories: "" });
  };

  const removeItem = (idx) => {
    const copy = structuredClone(week);
    copy[day][slot].items = (copy[day][slot].items || []).filter((_, i) => i !== idx);
    setWeek(copy);
  };

  const onSave = async () => {
    try {
      setSaving(true);
      await api.post("/mess/menu", {
        day,
        slot,
        items,
        capacity: Number(capacity) || 100,
      });
      toast.success("Menu saved");
      await loadWeek();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Manage Weekly Menu</h1>
        <div className="flex gap-2">
          <select value={day} onChange={(e)=>setDay(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300">
            {DAYS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
          </select>
          <select value={slot} onChange={(e)=>setSlot(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300">
            {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input
            type="number"
            min={0}
            value={capacity}
            onChange={(e)=>setCapacity(e.target.value)}
            className="w-28 px-3 py-2 rounded-lg border border-slate-300"
            placeholder="Capacity"
            aria-label="Capacity"
          />
          <button onClick={onSave} disabled={saving} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3">Items for {day.toUpperCase()} • {slot}</h3>
        {items.length === 0 ? (
          <div className="text-slate-500">No items set</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((it, idx) => (
              <li key={idx} className="py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800">{it.name || String(it)}</div>
                  {Array.isArray(it.allergens) && it.allergens.length > 0 && (
                    <div className="text-xs text-slate-500">Allergens: {it.allergens.join(", ")}</div>
                  )}
                  {it.calories ? (
                    <div className="text-xs text-slate-500">Calories: {it.calories}</div>
                  ) : null}
                </div>
                <button onClick={()=>removeItem(idx)} className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3">Add Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <input value={newItem.name} onChange={(e)=>setNewItem({...newItem, name: e.target.value})} placeholder="Item name" className="md:col-span-4 px-3 py-2 rounded-lg border border-slate-300" />
          <input value={newItem.allergens} onChange={(e)=>setNewItem({...newItem, allergens: e.target.value})} placeholder="Allergens (comma-separated)" className="md:col-span-5 px-3 py-2 rounded-lg border border-slate-300" />
          <input value={newItem.calories} onChange={(e)=>setNewItem({...newItem, calories: e.target.value})} placeholder="Calories" className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300" />
          <button onClick={onAddItem} className="md:col-span-1 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Add</button>
        </div>
      </div>
    </div>
  );
};

export default MessMenuManage;
