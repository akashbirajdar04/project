import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";

const AcceptedMembers = () => {
  const messId = localStorage.getItem("Id");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/Profile/Messaccepted/${messId}`);
      setItems(res.data?.data ?? []);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load accepted members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (messId) load(); }, [messId]);

  const remove = async (userId) => {
    try {
      await api.delete(`/Profile/Messaccepted/${messId}/${userId}`);
      toast.success("Removed from accepted list");
      setItems((prev) => prev.filter((u) => u._id !== userId));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to remove");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Accepted Members</h1>

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 text-center">
          <div className="text-3xl mb-2">👥</div>
          <div className="font-semibold text-slate-800">No accepted members yet</div>
          <p className="text-slate-500 text-sm mt-1">Accept requests to see members here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {items.map((u) => (
            <div key={u._id} className="p-4 border rounded-xl bg-white shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-800">
                <div className="h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center font-semibold">
                  {(u?.username || u?.email || "?").substring(0,1).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium">{u?.username || u?.email}</div>
                  {u?.email && <div className="text-xs text-slate-500">{u.email}</div>}
                </div>
              </div>
              <button onClick={() => remove(u._id)} className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AcceptedMembers;
