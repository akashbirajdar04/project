import io from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:3000", {
    autoConnect: true,
    reconnection: true,
});

export default socket;
