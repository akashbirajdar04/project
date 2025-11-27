import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { Calendar, Clock, Plus, Trash2, Save, Utensils, Flame, AlertTriangle, Loader2 } from "lucide-react";

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const SLOTS = ["breakfast", "lunch", "dinner"];

const MessMenuManage = () => {
  const [week, setWeek] = useState({});
  const [day, setDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  const [slot, setSlot] = useState("lunch");
  const [capacity, setCapacity] = useState(100);
  const [newItem, setNewItem] = useState({ name: "", allergens: "", calories: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const items = useMemo(() => week?.[day]?.[slot]?.items ?? [], [week, day, slot]);

  const loadWeek = async () => {
    try {
      setLoading(true);
      const res = await api.get("/mess/menu/week");
      const data = res.data?.data ?? {};
      setWeek(data);
      const cap = data?.[day]?.[slot]?.capacity ?? 100;
      setCapacity(cap);
    } catch (e) {
      console.error(e);
      // toast.error("Failed to load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadWeek(); }, []);
  useEffect(() => {
    const cap = week?.[day]?.[slot]?.capacity ?? 100;
    setCapacity(cap);
  }, [day, slot, week]);

  // 🔔 Real-time update
  useEffect(() => {
    const handleUpdate = (data) => {
      if (data && data.relatedModel === "Menu") {
        loadWeek();
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
  }, []);

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
      toast.success("Menu saved successfully");
      await loadWeek();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Menu</h1>
          <p className="text-slate-500 text-sm mt-1">Plan meals and manage capacity</p>
        </div>

        <div className="flex flex-wrap gap-3 items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:ring-blue-500 focus:border-blue-500 uppercase font-medium"
            >
              {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg border border-slate-300 bg-white text-sm focus:ring-blue-500 focus:border-blue-500 capitalize font-medium"
            >
              {SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="h-8 w-px bg-slate-200 mx-1"></div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">Capacity:</span>
            <input
              type="number"
              min={0}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-20 px-2 py-2 rounded-lg border border-slate-300 text-sm text-center font-medium"
            />
          </div>

          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70 font-medium transition-colors ml-auto"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Item Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden sticky top-6">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 font-semibold text-slate-800">
              Add New Item
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Item Name</label>
                <input
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Paneer Butter Masala"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Allergens (Optional)</label>
                <input
                  value={newItem.allergens}
                  onChange={(e) => setNewItem({ ...newItem, allergens: e.target.value })}
                  placeholder="e.g. Dairy, Nuts"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Calories (Optional)</label>
                <input
                  value={newItem.calories}
                  onChange={(e) => setNewItem({ ...newItem, calories: e.target.value })}
                  placeholder="e.g. 350"
                  type="number"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={onAddItem}
                className="w-full py-2.5 rounded-lg bg-slate-800 text-white hover:bg-slate-900 font-medium transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </button>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center capitalize">
                <Utensils className="w-4 h-4 mr-2 text-blue-600" />
                {day} • {slot} Menu
              </h3>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {items.length} items
              </span>
            </div>

            <div className="p-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                  <Utensils className="w-12 h-12 mb-3 opacity-20" />
                  <p>No items added yet</p>
                  <p className="text-xs mt-1">Use the form to add items to this slot</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {items.map((it, idx) => (
                    <li key={idx} className="group flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div>
                        <div className="font-semibold text-slate-800 text-base">{it.name || String(it)}</div>
                        <div className="flex items-center gap-3 mt-1">
                          {Array.isArray(it.allergens) && it.allergens.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                              <AlertTriangle size={10} />
                              {it.allergens.join(", ")}
                            </div>
                          )}
                          {it.calories ? (
                            <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              <Flame size={10} />
                              {it.calories} kcal
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessMenuManage;
