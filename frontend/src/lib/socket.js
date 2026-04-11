import io from "socket.io-client";

// Initialize socket connection
const socket = io(import.meta.env.VITE_API_URL || "https://managment-frontends-1.onrender.com", {
    autoConnect: true,
    reconnection: true,
});

export default socket;
