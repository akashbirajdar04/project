import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { Users, UserMinus, Loader2, Search } from "lucide-react";

const AcceptedMembers = () => {
  const messId = localStorage.getItem("Id");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/Profile/Messaccepted/${messId}`);
      setItems(res.data?.data ?? []);
    } catch (e) {
      // toast.error("Failed to load accepted members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (messId) load(); }, [messId]);

  const remove = async (userId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await api.delete(`/Profile/Messaccepted/${messId}/${userId}`);
      toast.success("Removed from accepted list");
      setItems((prev) => prev.filter((u) => u._id !== userId));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to remove");
    }
  };

  const filteredItems = items.filter(u =>
    (u.username?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (u.email?.toLowerCase() || "").includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Accepted Members</h1>
          <p className="text-slate-500 text-sm mt-1">Manage students enrolled in your mess</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No accepted members yet</h3>
          <p className="text-slate-500 text-sm mt-1">Accept requests from the Requests tab to see members here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((u) => (
              <div key={u._id} className="p-5 border border-slate-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 grid place-items-center font-bold text-lg">
                    {(u?.username || u?.email || "?").substring(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{u?.username || "Unknown User"}</div>
                    {u?.email && <div className="text-xs text-slate-500">{u.email}</div>}
                  </div>
                </div>
                <button
                  onClick={() => remove(u._id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Remove member"
                >
                  <UserMinus size={18} />
                </button>
              </div>
            ))}
          </div>
          {filteredItems.length === 0 && search && (
            <div className="text-center py-12 text-slate-500">
              No members found matching "{search}"
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AcceptedMembers;
