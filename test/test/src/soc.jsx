import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";

export const PrivateChat = () => {
  const { userId } = useParams(); // Receiver's ID
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const currentUserId = localStorage.getItem("Id");
  const socketRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const socket = io("http://localhost:3000", {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("✅ Socket.IO connected:", socket.id);
      setIsConnected(true);
      setConnectionError(false);
      
      // Join a room for this chat
      if (currentUserId && userId) {
        socket.emit("join_room", { sender: currentUserId, receiver: userId });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket.IO disconnected:", reason);
      setIsConnected(false);
      if (reason === "io server disconnect") {
        // Server disconnected, try to reconnect
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket.IO connection error:", error.message);
      setIsConnected(false);
      setConnectionError(true);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket.IO reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
      setConnectionError(false);
      if (currentUserId && userId) {
        socket.emit("join_room", { sender: currentUserId, receiver: userId });
      }
    });

    socket.on("reconnect_error", (error) => {
      console.error("❌ Socket.IO reconnection error:", error.message);
      setConnectionError(true);
    });

    socket.on("reconnect_failed", () => {
      console.error("❌ Socket.IO reconnection failed");
      setConnectionError(true);
    });

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

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("reconnect");
      socket.off("reconnect_error");
      socket.off("reconnect_failed");
      socket.off("receive_message");
      socket.disconnect();
    };
  }, [currentUserId, userId]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !isConnected) {
      if (!isConnected) {
        alert("Cannot send message: Not connected to server. Please make sure the backend is running.");
      }
      return;
    }

    const msgData = {
      sender: currentUserId,
      receiver: userId,
      message: input,
    };

    // Emit via socket
    socketRef.current.emit("send_message", msgData);

    // Optimistically add to UI
    setMessages((prev) => [...prev, { ...msgData, sender: { _id: currentUserId } }]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
      {/* Connection Status */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Chat with {userId}
        </h2>
        <div className="flex items-center gap-2">
          {connectionError ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200">
              <WifiOff className="w-4 h-4 text-red-600" />
              <span className="text-xs font-medium text-red-700">Disconnected</span>
            </div>
          ) : isConnected ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <Wifi className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200">
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-medium text-amber-700">Connecting...</span>
            </div>
          )}
        </div>
      </div>

      {connectionError && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800 mb-1">Connection Error</p>
            <p className="text-xs text-red-700">
              Unable to connect to the server. Please make sure the backend server is running on <code className="bg-red-100 px-1.5 py-0.5 rounded">http://localhost:3000</code>
            </p>
            <p className="text-xs text-red-600 mt-2">
              To start the backend: <code className="bg-red-100 px-1.5 py-0.5 rounded">cd pro && npm run dev</code>
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto border-2 border-slate-200 p-4 mb-4 rounded-xl bg-white/80 backdrop-blur-sm flex flex-col gap-3 shadow-inner">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p className="text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl max-w-[75%] shadow-sm ${
                m.sender?._id === currentUserId || m.sender === currentUserId
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white self-end ml-auto"
                  : "bg-slate-100 text-slate-800 self-start"
              }`}
            >
              <div className="text-xs font-semibold mb-1 opacity-80">
                {m.sender?._id === currentUserId || m.sender === currentUserId
                  ? "You"
                  : m.sender?.name || m.sender?.email || "Unknown"}
              </div>
              <div className="text-sm">{m.message}</div>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          disabled={!isConnected}
          className={`flex-1 border-2 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
            isConnected
              ? "border-slate-200 focus:border-indigo-500 focus:ring-indigo-200"
              : "border-slate-300 bg-slate-100 cursor-not-allowed"
          }`}
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !input.trim()}
          className={`px-6 py-3 rounded-xl font-semibold transition-all shadow-lg ${
            isConnected && input.trim()
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};
