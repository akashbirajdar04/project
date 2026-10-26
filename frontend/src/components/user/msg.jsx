import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
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
    <div className="msg-container">
      {/* UI elements such as search input, list of hostels, etc. */}
      <div className="search-bar">
        <Search />
        <input
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={handleInputChange}
          className="search-input"
        />
      </div>
      <div className="hostel-list">
        {hostel.map((h) => (
          <div key={h._id} className="hostel-item" onClick={() => openChat(h._id)}>
            <User />
            <span>{h.name}</span>
            {h.unreadCount > 0 && <span className="unread-badge">{h.unreadCount}</span>}
          </div>
        ))}
      </div>
      {/* Render child routes when a chat is open */}
      {isChatOpen && <Outlet />}
    </div>
  );
};