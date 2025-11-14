import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";

export const Announcements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [form, setForm] = useState({ title: "", body: "", scope: "global" });

  const role = localStorage.getItem("role");

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { q };
      if (scopeFilter !== "all") params.scope = scopeFilter;
      const res = await api.get("/announcements", { params });
      setItems(res.data?.data ?? []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchData();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, scopeFilter]);

  const onCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post("/announcements", form);
      setForm({ title: "", body: "", scope: form.scope });
      toast.success("Announcement published");
      await fetchData();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to publish");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Announcements</h1>
        <div className="flex gap-2">
          <select
            value={scopeFilter}
            onChange={(e)=>setScopeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300"
          >
            <option value="all">All</option>
            <option value="global">Global</option>
            <option value="hostel">Hostel</option>
            <option value="block">Block</option>
            <option value="mess">Mess</option>
          </select>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="px-3 py-2 rounded-lg border border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
          />
        </div>
      </div>

      {(role === "warden" || role === "hostelowner" || role === "messowner") && (
        <form onSubmit={onCreate} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white border border-slate-200 rounded-xl p-4">
          <input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Title"
            className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
            required
          />
          <select
            value={form.scope}
            onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
            className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none"
          >
            <option value="global">Global</option>
            <option value="hostel">Hostel</option>
            <option value="block">Block</option>
            <option value="mess">Mess</option>
          </select>
          <input
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="Message"
            className="md:col-span-5 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
            required
          />
          <button type="submit" className="md:col-span-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Publish</button>
        </form>
      )}

      <div className="grid gap-3">
        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-slate-500">No announcements</div>
        ) : (
          items.map((a) => (
            <div key={a._id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{a.title}</h3>
                <span className="text-xs rounded px-2 py-0.5 border bg-emerald-50 border-emerald-200 text-emerald-700">
                  {a.scope}
                </span>
              </div>
              <p className="text-slate-700 mt-1">{a.body}</p>
              <div className="text-xs text-slate-500 mt-2">{new Date(a.createdAt).toLocaleString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
