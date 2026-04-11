import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../../lib/api";
import { Search, MessageSquare, User } from "lucide-react";
import debounce from "lodash/debounce";

export const Msg = () => {
  const [hostel, setHostel] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // For API
  const [inputValue, setInputValue] = useState(""); // For Input UI
  const Id = localStorage.getItem("Id");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!Id) return;
    api
      .get(`/Profile/student/${Id}/hostel`, {
        params: { name: searchQuery },
      })
      .then((res) => {
        setHostel(Array.isArray(res.data.data) ? res.data.data : [res.data.data]);
      })
      .catch((e) => { console.error(e); });
  }, [Id, searchQuery]);

  const openChat = (userId) => {
    // Optimistically clear unread count
    setHostel((prev) =>
      prev.map((h) =>
        h._id === userId ? { ...h, unreadCount: 0 } : h
      )
    );
    navigate(`chat/${userId}`);
  };

  // Memoize the debounced function so it doesn't get recreated on every render
  const debouncedSearch = useCallback(
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

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Check if a chat is selected (we are in a child route)
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
          {hostel.length > 0 ? (
            hostel.map((res) => (
              <button
                key={res?._id || res?.name}
                onClick={() => openChat(res?._id)}
                className="w-full text-left p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {res?.name?.charAt(0) || <User size={18} />}
                  </div>
                  <div>
                    <div className="flex justify-between items-center w-full">
                      <div className="font-semibold text-slate-800 text-sm">{res?.name}</div>
                      {res?.lastMessageTime && (
                        <span className="text-[10px] text-slate-400 ml-2">
                          {new Date(res.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-xs text-slate-500 truncate max-w-[120px]">Tap to chat</div>
                      {res?.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {res.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-center p-4">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3 text-slate-400">
                <MessageSquare size={24} />
              </div>
              <p className="text-sm text-slate-500 font-medium">No conversations found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for a different name</p>
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
}
