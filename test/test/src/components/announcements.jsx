import { useEffect, useState } from "react";
import api from "../lib/api";
import { toast } from "sonner";
import { Search, Bell, Send, Calendar, AlertTriangle, Loader2 } from "lucide-react";

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with title and filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Bell className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search announcements..."
              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300 border p-2"
            />
          </div>
          
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="block w-full md:w-48 px-3 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="all">All Announcements</option>
            <option value="global">Global</option>
            <option value="hostel">Hostel</option>
            <option value="block">Block</option>
            <option value="mess">Mess</option>
          </select>
        </div>
      </div>

      {/* Create Announcement Form */}
      {(role === "warden" || role === "hostelowner" || role === "messowner") && (
        <div className="bg-white shadow overflow-hidden rounded-lg mb-8">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Create New Announcement</h3>
          </div>
          <form onSubmit={onCreate} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 py-2 sm:text-sm border-gray-300 rounded-md border"
                    placeholder="Announcement title"
                    required
                  />
                </div>
              </div>
              
              <div className="md:col-span-3">
                <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">
                  Scope
                </label>
                <select
                  id="scope"
                  value={form.scope}
                  onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="global">Global</option>
                  <option value="hostel">Hostel</option>
                  <option value="block">Block</option>
                  <option value="mess">Mess</option>
                </select>
              </div>
              
              <div className="md:col-span-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="message"
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    className="flex-1 block w-full rounded-r-md sm:text-sm border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter announcement message"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Send className="-ml-1 mr-2 h-4 w-4" />
                    Publish
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Announcements</h3>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
            <p className="mt-2 text-sm text-gray-500">Loading announcements...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <Bell className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No announcements</h3>
            <p className="mt-1 text-sm text-gray-500">
              {q ? 'No announcements match your search.' : 'Get started by creating a new announcement.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {items.map((item) => (
              <li key={item._id} className="hover:bg-gray-50 transition-colors duration-150">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {item.postedBy?.name || 'System'}
                          </p>
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {item.scope.charAt(0).toUpperCase() + item.scope.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-lg font-semibold text-gray-900">{item.title}</h4>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{item.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
