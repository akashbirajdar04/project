import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import api from "../../lib/api";
import { Search, MessageSquare, User, ChevronDown } from "lucide-react";
import debounce from "lodash/debounce";

export const Message = () => {
  const [msg, setMsg] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const Id = localStorage.getItem("Id");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchMessages = async (reset = false) => {
    if (loading) return;
    setLoading(true);

    let endpoint = "";
    if (role === "hostelowner") {
      endpoint = `/Profile/Hostelrequest/${Id}/msglist`;
    } else if (role === "messowner") {
      endpoint = `/Profile/Messrequest/${Id}/msglist`;
    } else {
      console.warn("Unknown role for message list:", role);
      setLoading(false);
      return;
    }

    try {
      const currentPage = reset ? 1 : page;
      const res = await api.get(endpoint, {
        params: { name: searchQuery, page: currentPage, limit: 20 },
      });

      const newData = res.data.data || [];
      const pagination = res.data.pagination;

      if (reset) {
        setMsg(newData);
      } else {
        setMsg((prev) => [...prev, ...newData]);
      }

      setHasMore(currentPage < pagination.pages);
      setPage(currentPage + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and search change
  useEffect(() => {
    setPage(1);
    fetchMessages(true);
  }, [Id, searchQuery, role]);

  const openChat = (userId) => {
    // Optimistically clear unread count
    setMsg((prev) =>
      prev.map((m) =>
        m._id === userId ? { ...m, unreadCount: 0 } : m
      )
    );
    navigate(`chat/${userId}`);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((val) => {
        setSearchQuery(val);
      }, 300),
    []
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSearch(val);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const isChatOpen = location.pathname.includes('/chat/');

  return (
    <div className="h-[calc(100vh-140px)] min-h-[500px] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex">
      {/* Sidebar / Message List */}
      <aside className={`${isChatOpen ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-slate-200 bg-slate-50`}>
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <MessageSquare className="text-blue-600" size={20} />
            Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search people..."
              value={inputValue}
              onChange={handleInputChange}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {msg.length > 0 ? (
            <>
              {msg.map((res) => (
                <button
                  key={res._id}
                  onClick={() => openChat(res._id)}
                  className="w-full text-left p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors overflow-hidden">
                      {res.avatar ? (
                        <img src={res.avatar} alt={res.username} className="w-full h-full object-cover" />
                      ) : (
                        res.username?.charAt(0).toUpperCase() || <User size={18} />
                      )}
                    </div>
                    <div>
                      <div className="flex justify-between items-center w-full">
                        <div className="font-semibold text-slate-800 text-sm">{res.username || res.name || "Unknown User"}</div>
                        {res.lastMessageTime && (
                          <span className="text-[10px] text-slate-400 ml-2">
                            {new Date(res.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <div className="text-xs text-slate-500 truncate max-w-[120px]">Tap to chat</div>
                        {res.unreadCount > 0 && (
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {res.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}

              {hasMore && (
                <button
                  onClick={() => fetchMessages(false)}
                  disabled={loading}
                  className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg mt-2 flex items-center justify-center gap-1"
                >
                  {loading ? "Loading..." : <>Load More <ChevronDown size={14} /></>}
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center p-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-400">
                <MessageSquare size={24} />
              </div>
              <p className="text-sm text-slate-500 font-medium">{loading ? "Loading..." : "No conversations found"}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Chat Area */}
      <main className={`${!isChatOpen ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white`}>
        <Outlet />
        {!isChatOpen && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={40} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Select a conversation</h3>
            <p className="text-sm text-slate-500 mt-1">Choose a contact from the list to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
};
