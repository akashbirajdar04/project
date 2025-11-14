import { Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export const Message = () => {
  const [msg, setMsg] = useState([]);
  const [name, setName] = useState(""); // added state for search
  const Id = localStorage.getItem("Id");
  const navigate = useNavigate();

  useEffect(() => {
    // fetch message list whenever name changes
    axios
      .get(`http://localhost:3000/Profile/Hostelrequest/${Id}/msglist`, {
        params: { name },
      })
      .then((res) => setMsg(res.data))
      .catch((err) => alert("Can't fetch message list"));
  }, [Id, name]); // added dependency

  const openChat = (userId) => {
    navigate(`chat/${userId}`); // Relative path
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-4">
      {/* Message List */}
      <div className="w-1/3 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Messages</h2>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name..."
          value={name}
          onChange={(e) => setName(e.target.value)} // update name on every change
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {msg.length > 0 ? (
          msg.map((res) => (
            <div
              key={res._id || res.name}
              onClick={() => openChat(res._id)}
              className="p-3 rounded-md mb-2 cursor-pointer hover:bg-blue-50 shadow-sm"
            >
              {res.name}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages found.</p>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 ml-4 bg-white rounded-lg shadow-md p-4">
        <Outlet /> {/* This renders PrivateChat when a user is selected */}
      </div>
    </div>
  );
};
