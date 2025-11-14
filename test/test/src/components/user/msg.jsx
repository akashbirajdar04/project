import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const Msg = () => {
  const [hostel, setHostel] = useState([]);
  const [name, setName] = useState(""); // 👈 new state for search input
  const Id = localStorage.getItem("Id");
  const navigate = useNavigate();

  useEffect(() => {
    if (!Id) return;
    axios
      .get(`http://localhost:3000/Profile/student/${Id}/hostel`, {
        params: { name }, // 👈 send name as query
      })
      .then((res) => {
        setHostel(Array.isArray(res.data.data) ? res.data.data : [res.data.data]);
        console.log("hotels",hostel)
      })
      .catch(() => alert("Can't fetch message list"));
  }, [Id, name]); // 👈 runs every time name changes

  const openChat = (userId) => {
    navigate(`chat/${userId}`);
  };

  return (
    <div className="h-[70vh] grid grid-cols-12 gap-4">
      {/* Message List */}
      <aside className="col-span-12 md:col-span-4 bg-white rounded-xl shadow-md border border-slate-200 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-800">Messages</h2>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 mb-3 rounded-lg border border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-500"
        />

        <div className="flex-1 overflow-y-auto pr-1">
          {hostel.length > 0 ? (
            hostel.map((res) => (
              <button
                key={res?._id || res?.name}
                onClick={() => openChat(res?._id)}
                className="w-full text-left px-3 py-2 mb-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors shadow-sm"
              >
                <div className="font-medium text-slate-800">{res?.name}</div>
                <div className="text-xs text-slate-500">Open conversation</div>
              </button>
            ))
          ) : (
            <div className="h-full grid place-items-center text-center text-slate-500 px-4">
              <div>
                <div className="text-2xl mb-1">💬</div>
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs">Search by name to start a chat</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Chat area */}
      <section className="col-span-12 md:col-span-8 bg-white rounded-xl shadow-md border border-slate-200 p-4">
        <Outlet />
      </section>
    </div>
  );
}
