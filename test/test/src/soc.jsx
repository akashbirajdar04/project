import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "./lib/socket";

export const PrivateChat = () => {
  const { userId } = useParams(); // Receiver's ID
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const currentUserId = localStorage.getItem("Id");

  useEffect(() => {
    // Join a room for this chat
    if (currentUserId && userId) {
      socket.emit("join_room", { sender: currentUserId, receiver: userId });
    }

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:3000/Profile/messages/getAll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderId: currentUserId,
            receiverId: userId,
          }),
        });
        const data = await res.json();
        if (data.success) setMessages(data.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    // Listen for incoming messages via socket
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receive_message");
  }, [currentUserId, userId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msgData = {
      sender: currentUserId,
      receiver: userId,
      message: input,
    };

    // Emit via socket
    socket.emit("send_message", msgData);

    // Optimistically add to UI
    setMessages((prev) => [...prev, msgData]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full p-4 bg-slate-50">
      <h2 className="font-bold mb-2">Chat with {userId}</h2>
      <div className="flex-1 overflow-y-auto border p-2 mb-2 rounded bg-white flex flex-col gap-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[70%] ${m.sender._id === currentUserId ? "bg-blue-100 text-blue-900 self-end" : "bg-slate-100 text-slate-900 self-start"
              }`}
          >
            <b>{m.sender._id === currentUserId ? "You" : m.sender.name || m.sender.email}:</b>{" "}
            {m.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};
