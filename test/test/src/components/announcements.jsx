import { useEffect, useState, useMemo } from "react";
import api from "../lib/api";
import { toast } from "sonner";
import { Search, Bell, Send, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import debounce from "lodash/debounce";

export const Announcements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // For API
  const [inputValue, setInputValue] = useState(""); // For Input UI
  const [scopeFilter, setScopeFilter] = useState("all");
  const [form, setForm] = useState({ title: "", body: "", scope: "global" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAnnouncements, setTotalAnnouncements] = useState(0);
  const limit = 10;

  const role = localStorage.getItem("role");

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { q: searchQuery, page, limit };
      if (scopeFilter !== "all") params.scope = scopeFilter;
      const res = await api.get("/announcements", { params });
      setItems(res.data?.data ?? []);
      setPage(res.data?.page ?? 1);
      setTotalPages(res.data?.totalPages ?? 1);
      setTotalAnnouncements(res.data?.totalAnnouncements ?? 0);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, scopeFilter, page]);

  // Memoize the debounced function
  const debouncedSearch = useMemo(
    () =>
      debounce((val) => {
        setSearchQuery(val);
        setPage(1); // Reset to page 1 on search
      }, 400),
    []
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSearch(val);
  };

  const handleScopeChange = (e) => {
    setScopeFilter(e.target.value);
    setPage(1); // Reset to page 1 on filter change
  };

  // Cleanup
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

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
    <div className="max-w-5xl mx-auto">
      {/* Header with title and filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl text-blue-600">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Announcements</h1>
            <p className="text-slate-500 text-sm">Stay updated with latest news</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:placeholder-slate-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            />
          </div>

          <select
            value={scopeFilter}
            onChange={handleScopeChange}
            className="block w-full md:w-40 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg"
          >
            <option value="all">All</option>
            <option value="global">Global</option>
            <option value="hostel">Hostel</option>
            <option value="block">Block</option>
            <option value="mess">Mess</option>
          </select>
        </div>
      </div>

      {/* Create Announcement Form */}
      {(role === "warden" || role === "hostelowner" || role === "messowner") && (
        <div className="bg-white shadow-sm border border-slate-200 rounded-xl mb-8 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800">Create New Announcement</h3>
          </div>
          <form onSubmit={onCreate} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5">
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                  placeholder="Announcement title"
                  required
                />
              </div>

              <div className="md:col-span-3">
                <label htmlFor="scope" className="block text-sm font-medium text-slate-700 mb-1">
                  Scope
                </label>
                <select
                  id="scope"
                  value={form.scope}
                  onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                >
                  <option value="global">Global</option>
                  <option value="hostel">Hostel</option>
                  <option value="block">Block</option>
                  <option value="mess">Mess</option>
                </select>
              </div>

              <div className="md:col-span-4">
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                  Message
                </label>
                <div className="flex rounded-lg shadow-sm">
                  <input
                    type="text"
                    id="message"
                    value={form.body}
                    onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                    className="flex-1 block w-full rounded-l-lg border-slate-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm border px-3 py-2.5"
                    placeholder="Enter message"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
            <p className="mt-2 text-sm text-slate-500">Loading announcements...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100">
              <Bell className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-slate-900">No announcements</h3>
            <p className="mt-1 text-sm text-slate-500">
              {inputValue ? 'No announcements match your search.' : 'Get started by creating a new announcement.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {items.map((item) => (
                <div key={item._id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900">
                            {item.postedBy?.name || 'System'}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                            {item.scope}
                          </span>
                          <span className="text-xs text-slate-400">
                            • {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-slate-800 mb-1">{item.title}</h4>
                        <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-6 border-t border-slate-200 pt-4">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm text-slate-600 font-medium">
                Page {page} of {totalPages} ({totalAnnouncements} items)
              </span>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
