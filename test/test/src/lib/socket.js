import io from "socket.io-client";

// Initialize socket connection
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
    autoConnect: true,
    reconnection: true,
});

export default socket;
