import { useEffect, useState, useMemo } from "react";
import api from "../lib/api";
import { toast } from "sonner";
import { Search, Bell, Send, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import debounce from "lodash/debounce";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

export const Announcements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
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
  }, [searchQuery, scopeFilter, page]);

  const debouncedSearch = useMemo(
    () =>
      debounce((val) => {
        setSearchQuery(val);
        setPage(1);
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
    setPage(1);
  };

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
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header with title and filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Announcements</h1>
            <p className="text-xs text-slate-500">Stay updated with official campus notifications</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Search announcements..."
              className="pl-9 w-full sm:w-64"
            />
          </div>

          <select
            value={scopeFilter}
            onChange={handleScopeChange}
            className="flex h-9 w-full sm:w-36 rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-slate-700"
          >
            <option value="all">All Scopes</option>
            <option value="global">Global</option>
            <option value="hostel">Hostel</option>
            <option value="block">Block</option>
            <option value="mess">Mess</option>
          </select>
        </div>
      </div>

      {/* Create Announcement Form */}
      {(role === "warden" || role === "hostelowner" || role === "messowner" || role === "admin") && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-slate-50/60 py-3 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">Publish Announcement</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <form onSubmit={onCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-5">
                  <label htmlFor="title" className="block text-xs font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Announcement title"
                    required
                  />
                </div>

                <div className="md:col-span-3">
                  <label htmlFor="scope" className="block text-xs font-medium text-slate-700 mb-1">
                    Scope
                  </label>
                  <select
                    id="scope"
                    value={form.scope}
                    onChange={(e) => setForm((f) => ({ ...f, scope: e.target.value }))}
                    className="flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 text-slate-700"
                  >
                    <option value="global">Global</option>
                    <option value="hostel">Hostel</option>
                    <option value="block">Block</option>
                    <option value="mess">Mess</option>
                  </select>
                </div>

                <div className="md:col-span-4">
                  <label htmlFor="message" className="block text-xs font-medium text-slate-700 mb-1">
                    Message
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="message"
                      value={form.body}
                      onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                      placeholder="Message content"
                      required
                    />
                    <Button type="submit" variant="primary" className="shrink-0">
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                      Publish
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Announcements List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-slate-200/80">
            <Loader2 className="h-6 w-6 text-indigo-600 animate-spin mb-2" />
            <p className="text-xs text-slate-500">Loading announcements...</p>
          </div>
        ) : items.length === 0 ? (
          <Card className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 mb-3">
              <Bell className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-sm font-medium text-slate-900">No announcements found</h3>
            <p className="text-xs text-slate-500 mt-1">
              {inputValue ? 'No announcements match your search.' : 'No announcements published yet.'}
            </p>
          </Card>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item._id} className="p-5">
                  <div className="flex items-start gap-3.5">
                    <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-900">
                          {item.postedBy?.name || 'System'}
                        </span>
                        <Badge variant="secondary" className="capitalize text-[10px] py-0">
                          {item.scope}
                        </Badge>
                        <span className="text-[11px] text-slate-400">
                          • {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <span className="text-xs text-slate-500">
                Page {page} of {totalPages} ({totalAnnouncements} announcements)
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Announcements;
