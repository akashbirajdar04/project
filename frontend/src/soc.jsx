import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "./lib/socket";

export const PrivateChat = () => {
  const { userId } = useParams(); // Receiver's ID
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const currentUserId = localStorage.getItem("Id");

  useEffect(() => {
    // Helper to join room
    const joinRoom = () => {
      if (currentUserId && userId) {
        console.log("🔌 Joining room:", { sender: currentUserId, receiver: userId });
        socket.emit("join_room", { sender: currentUserId, receiver: userId });
      }
    };

    // Join immediately if connected
    if (socket.connected) joinRoom();

    // Re-join on reconnection (fixes "refresh to see" issue)
    socket.on("connect", joinRoom);

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "https://managment-frontends-1.onrender.com"}/Profile/messages/getAll`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sender: currentUserId,
            receiver: userId,
          }),
        });
        const data = await res.json();
        if (data.success) setMessages(data.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    const handleReceiveMessage = (msg) => {
      console.log("📩 New message received:", msg);
      // Only add if it belongs to this chat to avoid cross-talk
      const isRelated = (msg.sender === userId && msg.receiver === currentUserId) ||
        (msg.sender === currentUserId && msg.receiver === userId) ||
        (msg.sender?._id === userId) || (msg.sender?._id === currentUserId);

      if (isRelated) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    // Mark messages as read
    const markRead = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL || "https://managment-frontends-1.onrender.com"}/Profile/messages/markRead`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}` // Assuming token is stored
          },
          body: JSON.stringify({
            sender: userId,
            receiver: currentUserId,
          }),
        });
        // Dispatch event to update Layout badge
        window.dispatchEvent(new Event("messagesRead"));
      } catch (err) {
        console.error("Error marking messages as read:", err);
      }
    };

    if (currentUserId && userId) {
      markRead();
    }

    return () => {
      socket.off("connect", joinRoom);
      socket.off("receive_message", handleReceiveMessage);
    };
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
        {messages.map((m, i) => {
          const senderId = m.sender?._id || m.sender;
          const isMe = senderId === currentUserId;
          return (
            <div
              key={i}
              className={`p-2 rounded max-w-[70%] ${isMe ? "bg-blue-100 text-blue-900 self-end" : "bg-slate-100 text-slate-900 self-start"
                }`}
            >
              <b>{isMe ? "You" : m.sender?.name || m.sender?.email || "User"}:</b>{" "}
              {m.message}
            </div>
          );
        })}
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
