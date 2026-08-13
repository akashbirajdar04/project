import io from "socket.io-client";

// Initialize socket connection
const socket = io(import.meta.env.VITE_API_URL || "https://hosteldine.onrender.com", {
    autoConnect: true,
    reconnection: true,
});

export default socket;
